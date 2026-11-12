# Generates the VYRO brand artwork.
#
# Requirements: Windows PowerShell 5.1+ and System.Drawing (included with
# Windows). Run from the repository root:
#
#   powershell -ExecutionPolicy Bypass -File .\scripts\generate-brand-assets.ps1
#
# The mark is intentionally simple: a serif V on a charcoal metallic field,
# with a thin platinum rule. The same geometry is reused across the app icon,
# adaptive icon, monochrome icon, splash mark, and favicon.

param(
  [string]$OutDir = (Join-Path $PSScriptRoot '..\assets')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$OutDir = [System.IO.Path]::GetFullPath($OutDir)
if (-not (Test-Path -LiteralPath $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

$script:PlatinumLight = [System.Drawing.Color]::FromArgb(255, 242, 238, 230)
$script:Platinum = [System.Drawing.Color]::FromArgb(255, 214, 208, 195)
$script:PlatinumMuted = [System.Drawing.Color]::FromArgb(255, 185, 176, 160)
$script:Ink = [System.Drawing.Color]::FromArgb(255, 8, 9, 11)
$script:InkElevated = [System.Drawing.Color]::FromArgb(255, 30, 31, 37)

function New-RoundedPath {
  param(
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  if ($Radius -le 0) {
    $path.AddRectangle($Rect)
    return $path
  }

  $diameter = [Math]::Min($Radius * 2, [Math]::Min($Rect.Width, $Rect.Height))
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-Canvas {
  param(
    [int]$Size,
    [switch]$Transparent
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  if ($Transparent) {
    $graphics.Clear([System.Drawing.Color]::Transparent)
  } else {
    $graphics.Clear($script:Ink)
  }

  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Add-Surface {
  param(
    [System.Drawing.Graphics]$Graphics,
    [int]$Size,
    [float]$Radius,
    [float]$Inset = 0
  )

  $rect = New-Object System.Drawing.RectangleF($Inset, $Inset, ($Size - ($Inset * 2)), ($Size - ($Inset * 2)))
  $path = New-RoundedPath -Rect $rect -Radius $Radius

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    $script:InkElevated,
    $script:Ink,
    135
  )
  $Graphics.FillPath($brush, $path)
  $brush.Dispose()

  $state = $Graphics.Save()
  $Graphics.SetClip($path)

  $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $glowPath.AddEllipse(-$Size * 0.35, -$Size * 0.45, $Size * 0.95, $Size * 0.95)
  $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
  $glow.CenterColor = [System.Drawing.Color]::FromArgb(34, 239, 234, 224)
  $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 239, 234, 224))
  $Graphics.FillPath($glow, $glowPath)
  $glow.Dispose()
  $glowPath.Dispose()

  $Graphics.Restore($state)
  $path.Dispose()
}

function Add-Monogram {
  param(
    [System.Drawing.Graphics]$Graphics,
    [int]$Size,
    [float]$FontSize,
    [bool]$WithRule = $true,
    [bool]$Monochrome = $false,
    [float]$VerticalOffset = 0
  )

  $font = New-Object System.Drawing.Font(
    'Georgia',
    $FontSize,
    [System.Drawing.FontStyle]::Regular,
    [System.Drawing.GraphicsUnit]::Pixel
  )

  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center

  $textRect = New-Object System.Drawing.RectangleF(0, $VerticalOffset, $Size, $Size)
  if ($Monochrome) {
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  } else {
    $gradientRect = New-Object System.Drawing.RectangleF(0, ($Size * 0.18), $Size, ($Size * 0.64))
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      $gradientRect,
      $script:PlatinumLight,
      $script:PlatinumMuted,
      90
    )
  }

  $Graphics.DrawString('V', $font, $brush, $textRect, $format)
  $brush.Dispose()
  $format.Dispose()
  $font.Dispose()

  if (-not $WithRule) {
    return
  }

  $ruleWidth = $Size * 0.17
  $ruleHeight = [Math]::Max(2.0, $Size * 0.004)
  $ruleX = ($Size - $ruleWidth) / 2
  $ruleY = ($Size * 0.705) + $VerticalOffset

  if ($Monochrome) {
    $ruleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  } else {
    $ruleBrush = New-Object System.Drawing.SolidBrush(
      [System.Drawing.Color]::FromArgb(130, 214, 208, 195)
    )
  }

  $Graphics.FillRectangle($ruleBrush, $ruleX, $ruleY, $ruleWidth, $ruleHeight)
  $ruleBrush.Dispose()
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )

  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
}

# App icon: full-bleed square. iOS and Android apply their own masks.
$iconSize = 1024
$icon = New-Canvas -Size $iconSize
Add-Surface -Graphics $icon.Graphics -Size $iconSize -Radius 0
Add-Monogram -Graphics $icon.Graphics -Size $iconSize -FontSize 500
Save-Png -Bitmap $icon.Bitmap -Path (Join-Path $OutDir 'icon.png')
$icon.Graphics.Dispose()
$icon.Bitmap.Dispose()

# Android adaptive foreground: transparent, mark kept inside the safe zone.
$foreground = New-Canvas -Size $iconSize -Transparent
Add-Monogram -Graphics $foreground.Graphics -Size $iconSize -FontSize 480
Save-Png -Bitmap $foreground.Bitmap -Path (Join-Path $OutDir 'android-icon-foreground.png')
$foreground.Graphics.Dispose()
$foreground.Bitmap.Dispose()

# Android adaptive background: a plain metallic charcoal field.
$background = New-Canvas -Size $iconSize
Add-Surface -Graphics $background.Graphics -Size $iconSize -Radius 0
Save-Png -Bitmap $background.Bitmap -Path (Join-Path $OutDir 'android-icon-background.png')
$background.Graphics.Dispose()
$background.Bitmap.Dispose()

# Android monochrome icon: white silhouette, tinted by the system.
$monochrome = New-Canvas -Size $iconSize -Transparent
Add-Monogram -Graphics $monochrome.Graphics -Size $iconSize -FontSize 480 -Monochrome $true
Save-Png -Bitmap $monochrome.Bitmap -Path (Join-Path $OutDir 'android-icon-monochrome.png')
$monochrome.Graphics.Dispose()
$monochrome.Bitmap.Dispose()

# Splash mark: a self-contained tile that sits on the dark splash background.
$splash = New-Canvas -Size $iconSize -Transparent
$tileInset = 92
Add-Surface -Graphics $splash.Graphics -Size $iconSize -Radius 230 -Inset $tileInset
Add-Monogram -Graphics $splash.Graphics -Size $iconSize -FontSize 430
Save-Png -Bitmap $splash.Bitmap -Path (Join-Path $OutDir 'splash-icon.png')
$splash.Graphics.Dispose()
$splash.Bitmap.Dispose()

# Web favicon.
$faviconSize = 196
$favicon = New-Canvas -Size $faviconSize
Add-Surface -Graphics $favicon.Graphics -Size $faviconSize -Radius 44
Add-Monogram -Graphics $favicon.Graphics -Size $faviconSize -FontSize 104
Save-Png -Bitmap $favicon.Bitmap -Path (Join-Path $OutDir 'favicon.png')
$favicon.Graphics.Dispose()
$favicon.Bitmap.Dispose()

Write-Host "VYRO brand assets written to $OutDir"
