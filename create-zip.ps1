# PowerShell script to create extension zip file
param(
    [string]$SourcePath = "dist",
    [string]$OutputPath = "dist.zip"
)

# Remove existing zip if it exists
if (Test-Path $OutputPath) {
    Write-Host "Removing existing $OutputPath..."
    Remove-Item $OutputPath -Force
}

# Wait a moment for file system to release the file
Start-Sleep -Seconds 1

# Create new zip file
Write-Host "Creating $OutputPath from $SourcePath..."
try {
    Compress-Archive -Path "$SourcePath\*" -DestinationPath $OutputPath -Force
    Write-Host "Successfully created $OutputPath"
} catch {
    Write-Error "Failed to create zip: $_"
    exit 1
}

# Show zip contents
Write-Host ""
Write-Host "Zip contents:"
Get-ChildItem $OutputPath | Select-Object Name, Length, LastWriteTime
