# High-Accuracy Training Script
# This script can be run from anywhere - it finds the correct directory automatically

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HIGH-ACCURACY TRAINING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Current directory: $PWD" -ForegroundColor Green
Write-Host ""

# Verify script exists
if (-not (Test-Path "train_facial_emotion_torch.py")) {
    Write-Host "ERROR: train_facial_emotion_torch.py not found!" -ForegroundColor Red
    Write-Host "Expected location: $PWD\train_facial_emotion_torch.py" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Script found! Starting training..." -ForegroundColor Green
Write-Host ""
Write-Host "Training configuration:" -ForegroundColor Cyan
Write-Host "  Model: EfficientNet-B0" -ForegroundColor White
Write-Host "  Epochs: 80" -ForegroundColor White
Write-Host "  Batch Size: 16" -ForegroundColor White
Write-Host "  Input Size: 224x224" -ForegroundColor White
Write-Host "  GPU: Enabled" -ForegroundColor White
Write-Host ""
Write-Host "This will take 2-4 hours..." -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 2

# Run training
python train_facial_emotion_torch.py `
    --model efficientnet_b0 `
    --epochs 80 `
    --batch-size 16 `
    --input-size 224 `
    --lr 1e-4 `
    --weight-decay 1e-4 `
    --scheduler cosine `
    --patience 10 `
    --use-amp `
    --mixup 0.2 `
    --label-smoothing 0.1 `
    --num-workers 4

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR OCCURRED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the error messages above." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Training completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
pause

