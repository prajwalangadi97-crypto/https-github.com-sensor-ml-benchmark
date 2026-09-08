# Build Dataforge.zip for Unstop Submission
$dest1 = ".\Dataforge.zip"
$dest2 = "..\Dataforge.zip"

if (Test-Path $dest1) { Remove-Item $dest1 -Force }
if (Test-Path $dest2) { Remove-Item $dest2 -Force }

$staging = ".\temp_dataforge_pkg"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

# 1. Copy root-level deliverables from submission/
Copy-Item -Path ".\submission\*" -Destination $staging -Recurse -Force

# 2. Copy source code folders
Copy-Item -Path ".\src" -Destination $staging -Recurse -Force
Copy-Item -Path ".\server" -Destination $staging -Recurse -Force
Copy-Item -Path ".\public" -Destination $staging -Recurse -Force

# 3. Copy essential project configuration and database files
$configFiles = @(
    "index.html",
    "standalone_app.html",
    "sensor_ml.db",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "tailwind.config.js",
    "postcss.config.js",
    "readme.md",
    ".env.example"
)

foreach ($f in $configFiles) {
    if (Test-Path $f) {
        Copy-Item -Path $f -Destination $staging -Force
    }
}

# Compress into Dataforge.zip
Compress-Archive -Path "$staging\*" -DestinationPath $dest1 -Force
Copy-Item -Path $dest1 -Destination $dest2 -Force
Remove-Item $staging -Recurse -Force

Write-Output "Successfully generated Dataforge.zip:"
Get-Item $dest1, $dest2 | Select-Object FullName, Length, LastWriteTime
