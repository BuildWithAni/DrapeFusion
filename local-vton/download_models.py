"""
download_models.py
Downloads only the 3 missing IDM-VTON model weight files (~1.3 GB total).
Uses hf-mirror.com for better connectivity in Asia.
"""
import os
from huggingface_hub import hf_hub_download

MODELS_DIR = r"C:\Users\Anirudh\Desktop\TryItNow\local-vton\models"
REPO = "yisol/IDM-VTON"

FILES = [
    ("image_encoder", "model.safetensors"),
    ("unet_encoder", "diffusion_pytorch_model.safetensors"),
    ("vae", "diffusion_pytorch_model.safetensors"),
]

def has_weights(subfolder, filename):
    dest = os.path.join(MODELS_DIR, subfolder, filename)
    return os.path.isfile(dest)

def main():
    # Try mirror if HF_ENDPOINT is not already set
    if "HF_ENDPOINT" not in os.environ:
        print("[INFO] Using hf-mirror.com for better download speed (set HF_ENDPOINT to override)")
        os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

    print("=" * 50)
    print(" Downloading IDM-VTON missing weights")
    print(" 3 files, ~1.3 GB total")
    print(" Mirror:", os.environ.get("HF_ENDPOINT", "huggingface.co"))
    print("=" * 50)
    print()

    for subfolder, filename in FILES:
        dest = os.path.join(MODELS_DIR, subfolder, filename)
        if has_weights(subfolder, filename):
            print(f"[OK] Already exists: {subfolder}/{filename}")
            continue

        print(f"[DL] Downloading {subfolder}/{filename} ...")
        try:
            path = hf_hub_download(
                repo_id=REPO,
                filename=f"{subfolder}/{filename}",
                local_dir=MODELS_DIR,
                local_dir_use_symlinks=False,
            )
            print(f"[DONE] Saved to: {path}")
        except Exception as e:
            print(f"[FAILED] {subfolder}/{filename}: {e}")

    print()
    print("=" * 50)
    print(" Download complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
