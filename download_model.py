import os
from huggingface_hub import snapshot_download

if __name__ == "__main__":
    repo_id = "yisol/IDM-VTON"
    local_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "local-vton", "models"))
    print(f"Downloading {repo_id} to {local_dir} ...")
    snapshot_download(
        repo_id=repo_id,
        local_dir=local_dir,
        local_dir_use_symlinks=False,  # important for Windows
        resume_download=True,
    )
    print("✅ Download finished without errors")
