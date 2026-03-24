param(
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$appHome = Resolve-Path (Join-Path $PSScriptRoot "..")
$releaseDir = Join-Path $appHome "release\dg-admin-web"

if (-not $SkipBuild) {
  Push-Location $appHome
  try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
      throw "前端构建失败，已中止生成发布包。"
    }
  } finally {
    Pop-Location
  }
}

if (Test-Path $releaseDir) {
  Remove-Item -Recurse -Force $releaseDir
}

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
Copy-Item -Recurse (Join-Path $appHome "dist") (Join-Path $releaseDir "dist")
New-Item -ItemType Directory -Force -Path (Join-Path $releaseDir "config") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $releaseDir "nginx\linux") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $releaseDir "nginx\windows") | Out-Null
Copy-Item (Join-Path $appHome "deploy\config\config.js.template") (Join-Path $releaseDir "config\config.js")
Copy-Item (Join-Path $appHome "deploy\nginx\linux\eam.conf") (Join-Path $releaseDir "nginx\linux\eam.conf")
Copy-Item (Join-Path $appHome "deploy\nginx\windows\eam.conf") (Join-Path $releaseDir "nginx\windows\eam.conf")

Write-Host "前端发布包已生成：$releaseDir"
