"""Preprocessing utilities shared between training and inference.

This module contains functions derived from the training script that
convert raw geospatial arrays into the 3-channel NDVI/VV/Red input used
by the Kaveri crop damage model, and helpers to write NPZ files for
training.
"""

import numpy as np


def make_model_input_from_bands(bands: np.ndarray) -> np.ndarray:
    """Convert a multi-band array into the 3-channel model input.

    The training pipeline stacked NDVI, VV and red channels extracted
    from Sentinel‑1 and Sentinel‑2 data.  To replicate that logic the
    incoming `bands` array is expected to have the following ordering
    (this mirrors the training NPZs):

        band0 = VV (from Sentinel-1)
        band3 = RED (from Sentinel-2)
        band7 = NIR (from Sentinel-2)

    If your Earth Engine asset uses a different layout you will need to
    rearrange accordingly before calling this function.

    Args:
        bands: NumPy array of shape (bands, height, width).
    Returns:
        Float32 array of shape (height, width, 3) scaled to [0,1].
    """

    if bands.ndim != 3 or bands.shape[0] < 8:
        raise ValueError("Expected at least 8 bands in the input array")

    # select channels according to training script
    vv = bands[0, ...]
    red = bands[3, ...]
    nir = bands[7, ...]

    ndvi = (nir - red) / (nir + red + 1e-6)

    # resize if necessary must be done outside (here we assume it's correct)
    img = np.stack([ndvi, vv, red], axis=-1)

    img = np.nan_to_num(img, nan=0.0, posinf=0.0, neginf=0.0)
    img = np.clip(img, -1.0, 1.0)

    min_val, max_val = img.min(), img.max()
    if max_val > min_val:
        img = (img - min_val) / (max_val - min_val)
    else:
        img = np.zeros_like(img)

    return img.astype(np.float32)


def save_training_npz(s1_array: np.ndarray, s2_array: np.ndarray, label: int, out_path: str):
    """Create a training-style NPZ file from S1/S2 arrays.

    This duplicates the behaviour of the original training script's
    dataset generation.  The NPZ will contain two keys:
    ``data`` (stacked 3-channel model input) and ``label`` (int).

    Args:
        s1_array: Sentinel-1 array with VV in band 0.
        s2_array: Sentinel-2 array with RED in band 3, NIR in band 7.
        label: integer class label for the tile.
        out_path: destination filename (will be overwritten).
    """
    bands = np.concatenate([s1_array[np.newaxis, ...], s2_array], axis=0)
    img, _ = load_tile_from_arrays(s1_array, s2_array, label)
    np.savez_compressed(out_path, data=img, label=label)


def load_tile_from_arrays(s1_img: np.ndarray, s2_img: np.ndarray, label: int):
    """Helper that mirrors ``load_tile`` from the training script.

    Arguments are identical to that function in the training code and this
    can be used if you already have arrays in memory (rather than file paths).
    """
    red = s2_img[:, :, 3]
    nir = s2_img[:, :, 7]

    ndvi = (nir - red) / (nir + red + 1e-6)
    vv = s1_img[:, :, 0]

    # assume caller will resize if needed
    img = np.stack([ndvi, vv, red], axis=-1)

    img = np.nan_to_num(img, nan=0.0, posinf=0.0, neginf=0.0)
    img = np.clip(img, -1.0, 1.0)

    min_val, max_val = img.min(), img.max()
    if max_val > min_val:
        img = (img - min_val) / (max_val - min_val)
    else:
        img = np.zeros_like(img)

    return img.astype(np.float32), label
