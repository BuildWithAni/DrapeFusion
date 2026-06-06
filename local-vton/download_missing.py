import os
from huggingface_hub import snapshot_download

BASE_DIR = r"C:\Users\Anirudh\Desktop\TryItNow\local-vton\models"

NEEDED = [
    "image_encoder",
    "text_encoder",
    "text_encoder_2",
    "tokenizer",
    "tokenizer_2",
    "unet_encoder",
    "scheduler",
    "vae",
]

def has_weights(folder):
    """Check if folder contains actual model weight files, not just config."""
    if not os.path.isdir(folder):
        return False
    for fname in os.listdir(folder):
        if fname.endswith((".bin", ".safetensors", ".h5", ".msgpack", ".ckpt")):
            return True
    return False

missing = [sub for sub in NEEDED if not has_weights(os.path.join(BASE_DIR, sub))]

if not missing:
    print("[download_missing] All model weights present. Nothing to download.")
else:
    print(f"[download_missing] Missing weights for: {', '.join(missing)}")
    print("[download_missing] Downloading full model from yisol/IDM-VTON (this may take a while)...")
    snapshot_download(
        repo_id="yisol/IDM-VTON",
        local_dir=BASE_DIR,
        local_dir_use_symlinks=False,
    )
    print("[download_missing] Download complete!")
