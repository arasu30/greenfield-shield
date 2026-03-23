"""Script to train the NASNet-based crop damage classifier.

This file mirrors the code you provided and is intended to be executed
outside of the FastAPI application (e.g. on a workstation or cloud VM).

Usage:
    python -m app.training.train_nasnet

Before running ensure the environment has the necessary packages
(see requirements.txt) and that the directories referenced by
BASE_DIR exist and contain the labelled NPZ files.
"""

import os
import shutil
import numpy as np
import cv2
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.applications import NASNetMobile
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, Input
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import CSVLogger, ModelCheckpoint

# =====================================================
# GPU SAFE SETTINGS (RTX 3050)
# =====================================================
gpus = tf.config.experimental.list_physical_devices("GPU")
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

# =====================================================
# PATHS
# =====================================================
BASE_DIR = r"G:\My Drive\labelled data"

S1_DIR = os.path.join(BASE_DIR, "s1_npz")
S2_DIR = os.path.join(BASE_DIR, "s2_npz")

IMG_SIZE = 224

# =====================================================
# LOG PATHS (LOCAL → DRIVE)
# =====================================================
LOCAL_LOG_DIR = "local_logs"
DRIVE_LOG_DIR = r"G:\My Drive\training_logs"

os.makedirs(LOCAL_LOG_DIR, exist_ok=True)
os.makedirs(DRIVE_LOG_DIR, exist_ok=True)

METRICS_CSV = os.path.join(LOCAL_LOG_DIR, "metrics.csv")
RUN_TXT = os.path.join(LOCAL_LOG_DIR, "run_log.txt")
LOCAL_MODEL_PATH = os.path.join(
    LOCAL_LOG_DIR, "nasnet_kaveri_crop_damage.keras"
)

# =====================================================
# SAFE LOGGER
# =====================================================
def log_print(msg):
    print(msg)
    with open(RUN_TXT, "a") as f:
        f.write(str(msg) + "\n")

# =====================================================
# TILE ID
# =====================================================
def get_tile_id(filename):
    return filename.split("_")[-1].split(".")[0]

# =====================================================
# LOAD SINGLE TILE
# =====================================================
def load_tile(s1_path, s2_path):
    s1 = np.load(s1_path)
    s2 = np.load(s2_path)

    s1_img = s1["data"]
    s2_img = s2["data"]
    label = int(s2["label"])

    red = s2_img[:, :, 3]
    nir = s2_img[:, :, 7]

    ndvi = (nir - red) / (nir + red + 1e-6)
    vv = s1_img[:, :, 0]

    red  = cv2.resize(red,  (IMG_SIZE, IMG_SIZE))
    ndvi = cv2.resize(ndvi, (IMG_SIZE, IMG_SIZE))
    vv   = cv2.resize(vv,   (IMG_SIZE, IMG_SIZE))

    img = np.stack([ndvi, vv, red], axis=-1)

    img = np.nan_to_num(img, nan=0.0, posinf=0.0, neginf=0.0)
    img = np.clip(img, -1.0, 1.0)

    min_val, max_val = img.min(), img.max()
    if max_val > min_val:
        img = (img - min_val) / (max_val - min_val)
    else:
        img = np.zeros_like(img)

    return img.astype(np.float32), label

# =====================================================
# LOAD DATASET
# =====================================================
def load_dataset():
    X, y = [], []

    s1_files = sorted(os.listdir(S1_DIR))
    s2_files = os.listdir(S2_DIR)
    s2_map = {get_tile_id(f): f for f in s2_files}

    total = len(s1_files)
    log_print(f"Total tiles: {total}")

    for i, s1_file in enumerate(s1_files):
        tile_id = get_tile_id(s1_file)

        if tile_id not in s2_map:
            continue

        img, label = load_tile(
            os.path.join(S1_DIR, s1_file),
            os.path.join(S2_DIR, s2_map[tile_id])
        )

        X.append(img)
        y.append(label)

        if (i + 1) % 10 == 0 or (i + 1) == total:
            log_print(f"Loaded {i + 1}/{total}")

    return np.array(X), np.array(y)

# =====================================================
# LOAD DATA
# =====================================================
log_print("Loading dataset...")
X, y = load_dataset()
log_print(f"Dataset shape: {X.shape} {y.shape}")

# =====================================================
# SPLIT
# =====================================================
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=42
)

X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, stratify=y_temp, random_state=42
)

# =====================================================
# CLASS WEIGHTS
# =====================================================
class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(y_train),
    y=y_train
)
class_weights = dict(enumerate(class_weights))
log_print(f"Class weights: {class_weights}")

# =====================================================
# NASNet MODEL
# =====================================================
num_classes = len(np.unique(y))

base_model = NASNetMobile(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)
base_model.trainable = False

inputs = Input(shape=(224, 224, 3))
x = base_model(inputs, training=False)
x = GlobalAveragePooling2D()(x)
x = Dropout(0.4)(x)
outputs = Dense(num_classes, activation="softmax")(x)

model = Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-4, clipnorm=1.0),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=["accuracy"]
)

model.summary()

# =====================================================
# CALLBACKS
# =====================================================
csv_logger = CSVLogger(METRICS_CSV, append=True)

checkpoint = ModelCheckpoint(
    filepath=os.path.join(LOCAL_LOG_DIR, "best_model.weights.h5"),
    monitor="val_loss",
    save_best_only=True,
    save_weights_only=True,
    verbose=1
)

# =====================================================
# TRAIN (FROZEN BASE)
# =====================================================
model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=40,
    batch_size=4,
    class_weight=class_weights,
    callbacks=[csv_logger, checkpoint]
)

# =====================================================
# FINE-TUNING
# =====================================================
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5, clipnorm=1.0),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    metrics=["accuracy"]
)

log_print("Fine-tuning...")

model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=10,
    batch_size=4,
    class_weight=class_weights,
    callbacks=[csv_logger, checkpoint]
)

# =====================================================
# TEST
# =====================================================
loss, acc = model.evaluate(X_test, y_test)
log_print(f"Test Accuracy: {acc}")

# =====================================================
# SAVE FINAL MODEL
# =====================================================
model.save(LOCAL_MODEL_PATH)
log_print("Model saved locally.")

# =====================================================
# COPY TO GOOGLE DRIVE
# =====================================================
shutil.copytree(
    LOCAL_LOG_DIR,
    DRIVE_LOG_DIR,
    dirs_exist_ok=True
)

log_print("Logs and model copied to Google Drive.")