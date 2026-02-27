import numpy as np


def predict_damage_from_array(arr: np.ndarray) -> int:
    """Placeholder damage classifier.

    The training pipeline expects a 3‑channel image (ndvi, vv, red) with
    values in [0,1].  If a raw multi‑band array is passed, it will be
    preprocessed automatically.

    Args:
        arr: either already-preprocessed float32 array
             (h, w, 3) or a raw (bands, h, w) array as returned by GEE.
    Returns:
        0 for no damage, 1 for damaged.
    """
    from app.services import preprocessing

    if arr.ndim == 3 and arr.shape[0] != 3:
        # assume raw band-first array, convert to model input
        arr = preprocessing.make_model_input_from_bands(arr)

    if arr.size == 0:
        raise ValueError("empty array provided to damage predictor")

    # simple threshold classifier remains
    mean_val = float(arr.mean())
    return 1 if mean_val < 0.5 else 0
