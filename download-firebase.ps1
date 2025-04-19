$version = "11.4.0"
$files = @("firebase-app.js", "firebase-firestore.js")
$baseUrl = "https://www.gstatic.com/firebasejs/$version"
$outputDir = "js\firebase"

# Create output directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Download each file
foreach ($file in $files) {
    $url = "$baseUrl/$file"
    $output = Join-Path $outputDir $file
    
    Write-Host "Downloading $file..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "✅ Downloaded $file" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error downloading $file: $_" -ForegroundColor Red
    }
} 