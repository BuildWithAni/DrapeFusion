# download_models.ps1
# Downloads only the missing IDM-VTON model weight files (~1.3 GB total)
# Run this from PowerShell

$venv_python = "C:\Users\Anirudh\Desktop\TryItNow\drapefusion\venv\Scripts\python.exe"
$models_dir = "C:\Users\Anirudh\Desktop\TryItNow\local-vton\models"
$repo = "yisol/IDM-VTON"

$files = @(
    @{subfolder="image_encoder"; filename="model.safetensors"}
    @{subfolder="unet_encoder"; filename="diffusion_pytorch_model.safetensors"}
    @{subfolder="vae"; filename="diffusion_pytorch_model.safetensors"}
)

Write-Host "========================================"
Write-Host " Downloading IDM-VTON missing weights"
Write-Host " 3 files, ~1.3 GB total"
Write-Host "========================================"
Write-Host ""

foreach ($f in $files) {
    $sub = $f["subfolder"]
    $fn  = $f["filename"]
    $dest = Join-Path (Join-Path $models_dir $sub) $fn
    if (Test-Path -LiteralPath $dest) {
        Write-Host "[OK] Already exists: $sub\$fn" -ForegroundColor Green
    } else {
        Write-Host "[DL] Downloading $sub/$fn ..." -ForegroundColor Yellow
        & $venv_python -c @"
from huggingface_hub import hf_hub_download
path = hf_hub_download(
    repo_id="$repo",
    filename="$sub/$fn",
    local_dir=r"$models_dir",
    local_dir_use_symlinks=False,
    resume_download=True,
)
print(f"Saved to: {path}")
"@
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[DONE] $sub\$fn" -ForegroundColor Green
        } else {
            Write-Host "[FAILED] $sub\$fn" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host " Download complete!"
Write-Host "========================================"
