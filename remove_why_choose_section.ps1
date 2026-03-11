# Safely remove the "Why Choose MaySecret?" section from Home.tsx
$path = "c:\Users\pranj\OneDrive\Desktop\Cursor Projects\e_commerce\maysecret\src\pages\Home.tsx"

if (-not (Test-Path $path)) {
  Write-Error "Home.tsx not found at $path"
  exit 1
}

$content = Get-Content $path -Raw

# Regex to remove the Features section block that starts with the comment and ends at </section>
$pattern = "\n\s*\{\/\* Features Section - Moved to Bottom \*\/\}[\s\S]*?\n\s*<\/section>"

if ($content -match $pattern) {
  $content = [regex]::Replace($content, $pattern, "", 1)
}

Set-Content -Path $path -Value $content -NoNewline
Write-Host "Removed 'Why Choose MaySecret?' section successfully."
