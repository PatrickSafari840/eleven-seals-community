<#
  THE ELEVEN SEALS COMMUNITY - sync.ps1
  Copies what the community page shows from the game folder next to it:
  the kingdoms, the Book of Monsters, What's new (game-data/) and the
  pictures they use (img/). Run it after you change the game:

    powershell -ExecutionPolicy Bypass -File sync.ps1
    powershell -ExecutionPolicy Bypass -File sync.ps1 -Game "D:\path\to\11_seals"
#>
param([string]$Game)
$ErrorActionPreference = 'Stop'
$here = $PSScriptRoot
if (-not $Game) { $Game = Join-Path (Split-Path -Parent $here) '11_seals' }
if (-not (Test-Path (Join-Path $Game 'index.html'))) { throw "Game folder not found: $Game" }

function Copy-Into($from, $to) { New-Item -ItemType Directory -Force (Split-Path -Parent $to) | Out-Null; Copy-Item $from $to -Force }

# data the page reads
foreach ($f in 'base.js', 'bestiary.js', 'tales.js') { Copy-Into (Join-Path $Game "data\$f") (Join-Path $here "game-data\$f") }

# the game's translations (fr, es, pt, ja, zh), listed in the order the game loads them
$langDst = Join-Path $here 'game-data\lang'
if (Test-Path $langDst) { Remove-Item $langDst -Recurse -Force }
New-Item -ItemType Directory -Force $langDst | Out-Null
$order = [regex]::Matches([IO.File]::ReadAllText((Join-Path $Game 'index.html')), 'src="lang/([\w-]+)\.js') | ForEach-Object { $_.Groups[1].Value }
foreach ($l in $order) { Copy-Item (Join-Path $Game "lang\$l.js") (Join-Path $langDst "$l.js") }
$list = ($order | ForEach-Object { "'$_'" }) -join ', '
[IO.File]::WriteAllText((Join-Path $langDst 'files.js'), "// written by sync.ps1: the game's translation files, in load order`nconst GAME_LANG_FILES = [$list];`n", (New-Object System.Text.UTF8Encoding $false))

# pictures
$img = Join-Path $here 'img'
foreach ($f in 'title\logo.png', 'title\art.jpg') { Copy-Into (Join-Path $Game "img\$f") (Join-Path $img $f) }
foreach ($s in 32, 180, 192, 512) { Copy-Into (Join-Path $Game "img\icons\icon-$s.png") (Join-Path $img "icons\icon-$s.png") }
foreach ($f in 'attr_str', 'attr_vit', 'attr_agi', 'attr_spi', 'seal', 'scroll', 'quill', 'map') { Copy-Into (Join-Path $Game "img\ui\$f.jpg") (Join-Path $img "ui\$f.jpg") }
Copy-Item (Join-Path $Game 'img\portrait') $img -Recurse -Force
foreach ($d in 'hero', 'event\war') { Get-ChildItem (Join-Path $Game "img\$d") -File | ForEach-Object { Copy-Into $_.FullName (Join-Path $img "$d\$($_.Name)") } }

# only the creatures the kingdoms use (monsters, Seal guardians, giants)
$base = [IO.File]::ReadAllText((Join-Path $Game 'data\base.js'))
$fauna = [regex]::Match($base, '(?s)const FAUNA = \{(.*?)\n\};').Groups[1].Value
$ids = New-Object System.Collections.Generic.HashSet[string]
foreach ($m in [regex]::Matches($fauna, '"monsters":\[([^\]]*)\]')) { foreach ($x in [regex]::Matches($m.Groups[1].Value, '"(\w+)"')) { [void]$ids.Add($x.Groups[1].Value) } }
foreach ($m in [regex]::Matches($fauna, '"(boss|giant)":"(\w+)"')) { [void]$ids.Add($m.Groups[2].Value) }
$n = 0
foreach ($id in $ids) { $src = Join-Path $Game "img\creature\$id.jpg"; if (Test-Path $src) { Copy-Into $src (Join-Path $img "creature\$id.jpg"); $n++ } }

$size = (Get-ChildItem $here -Recurse -File | Measure-Object Length -Sum).Sum / 1MB
Write-Output ("synced from {0}: {1} creatures, community folder {2:N1} MB" -f $Game, $n, $size)
