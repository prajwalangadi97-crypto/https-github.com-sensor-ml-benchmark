# PowerShell script to create clean project zip
$destination = ".\sensor_ml_benchmark_full_project.zip"
if (Test-Path $destination) { Remove-Item $destination -Force }

$staging = ".\temp_staging_pkg"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

$items = @(
    "src",
    "server",
    "public",
    "submission",
    "index.html",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "tailwind.config.js",
    "postcss.config.js",
    "standalone_app.html",
    "sensor_ml.db",
    "readme.md",
    ".env",
    "hackathon_submission.zip"
)

foreach ($i in $items) {
    if (Test-Path $i) {
        Copy-Item -Path $i -Destination $staging -Recurse -Force
    }
}

Compress-Archive -Path "$staging\*" -DestinationPath $destination -Force
Remove-Item $staging -Recurse -Force

Write-Output "Successfully created: $destination"
Get-Item $destination | Select-Object Name, Length, LastWriteTime
