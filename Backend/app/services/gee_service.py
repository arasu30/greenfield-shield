import logging

import numpy as np
import json

# Earth Engine SDK is optional; import lazily
try:
    import ee
except ImportError:
    ee = None

import requests

# rasterio is used to read GeoTIFF bytes
try:
    import rasterio
    from rasterio.io import MemoryFile
except ImportError:
    rasterio = None

logger = logging.getLogger(__name__)


def initialize_ee():
    """Initialize Google Earth Engine API if available.

    This function will attempt to initialize using default credentials.
    You must authenticate separately (e.g. `earthengine authenticate`) or
    configure a service account via environment variables.
    """
    if ee is None:
        raise RuntimeError("earthengine-api is not installed")

    try:
        ee.Initialize()
    except Exception as e:
        logger.debug("ee.Initialize() failed; trying without arguments: %s", e)
        ee.Initialize()


def fetch_geotiff_as_array(asset_id: str, region: dict, scale: int = 30) -> np.ndarray:
    """Download a GeoTIFF from Earth Engine and return as a NumPy array.

    Args:
        asset_id: GEE image or collection identifier (e.g. "LANDSAT/LC08/C01/T1_RT/LC08_044034_20140318").
        region: GeoJSON-style geometry or bounding box dict.
        scale: spatial resolution in meters.
    Returns:
        NumPy array containing image bands (bands, height, width).
    """
    if ee is None:
        raise RuntimeError("earthengine-api not available; install it in requirements.txt")
    if rasterio is None:
        raise RuntimeError("rasterio package not installed; needed to read GeoTIFF bytes")

    initialize_ee()

    image = ee.Image(asset_id)
    params = {
        "region": region,
        "scale": scale,
        "format": "GeoTIFF",
    }

    # using getDownloadURL is synchronous and simpler than Export.batch
    url = image.getDownloadURL(params)
    resp = requests.get(url)
    resp.raise_for_status()

    with MemoryFile(resp.content) as memfile:
        with memfile.open() as src:
            arr = src.read()  # shape (bands, rows, cols)
    return arr


def convert_array_to_npz(arr: np.ndarray, path: str) -> str:
    """Save a NumPy array to compressed .npz and return the filename."""
    np.savez_compressed(path, data=arr)
    return path


def extract_coordinates_from_farm_boundary(farm_obj) -> dict:
    """Extract GeoJSON coordinates from a PostGIS Farm boundary.
    
    Args:
        farm_obj: SQLAlchemy Farm model instance with boundary geometry.
    Returns:
        GeoJSON-style dict with coordinates for use with Earth Engine.
    """
    from shapely import wkt
    
    if not farm_obj or not farm_obj.boundary:
        raise ValueError("Farm object missing or boundary is empty")
    
    # The boundary is stored as WKT in PostGIS
    # We need to parse it and convert to GeoJSON coordinates
    try:
        # The boundary string from the DB includes "POLYGON((...))" format
        boundary_str = str(farm_obj.boundary)
        
        # Parse using shapely if available, otherwise parse manually
        try:
            from shapely import wkt as shapely_wkt
            geom = shapely_wkt.loads(boundary_str)
            coords = list(geom.exterior.coords)
            geojson_coords = [[lon, lat] for lon, lat in coords]
        except:
            # Fallback: manual parsing for simple polygons
            # Extract coordinates from "POLYGON((lon lat, lon lat, ...))"
            import re
            match = re.search(r'POLYGON\(\((.*?)\)\)', boundary_str)
            if not match:
                raise ValueError(f"Could not parse boundary: {boundary_str}")
            
            coords_str = match.group(1)
            coord_pairs = coords_str.split(',')
            geojson_coords = []
            for pair in coord_pairs:
                lon, lat = pair.strip().split()
                geojson_coords.append([float(lon), float(lat)])
        
        return {
            "type": "Polygon",
            "coordinates": [geojson_coords]
        }
    except Exception as e:
        logger.error(f"Error extracting coordinates: {e}")
        raise ValueError(f"Failed to extract coordinates from farm boundary: {e}")
