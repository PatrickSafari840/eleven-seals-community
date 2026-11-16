<#
  THE ELEVEN SEALS COMMUNITY - publish.ps1
  Copies the latest kingdoms, monsters, news and pictures from the game
  (sync.ps1), then puts the page online on GitHub Pages:
    https://patricksafari840.github.io/eleven-seals-community/
  Needs Git and the GitHub CLI, signed in (gh auth login). Run it from this folder:

    powershell -ExecutionPolicy Bypass -File publish.ps1
    powershell -ExecutionPolicy Bypass -File publish.ps1 -Message "New monsters"
#>
param([string]$Message = 'Update the community page')
$ErrorActionPreference = 'Stop'
$env:PATH = 'C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;' + $env:PATH
Set-Location $PSScriptRoot
& (Join-Path $PSScriptRoot 'sync.ps1')
git add -A
if (-not (git status --porcelain)) { Write-Output 'Nothing changed: the page online is already up to date.'; return }
git commit -q -m $Message
git push -q origin main
Write-Output 'Published. GitHub Pages updates the site in a minute or two:'
Write-Output 'https://patricksafari840.github.io/eleven-seals-community/'
