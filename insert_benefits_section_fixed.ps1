# Safe script to insert BenefitsSection into Home.tsx
$homeTsxPath = "c:\Users\pranj\OneDrive\Desktop\Cursor Projects\e_commerce\maysecret\src\pages\Home.tsx"

if (-not (Test-Path $homeTsxPath)) {
  Write-Error "Home.tsx not found at $homeTsxPath"
  exit 1
}

$content = Get-Content $homeTsxPath -Raw

# 1) Add import if missing
if ($content -notmatch "import\s+BenefitsSection\s+from\s+'\.\./components/BenefitsSection';") {
  # Insert after FloatingSocialButtons import if present
  if ($content -match "import\s+FloatingSocialButtons\s+from\s+'\.\./components/FloatingSocialButtons';\r?\n") {
    $content = $content -replace "(import\s+FloatingSocialButtons\s+from\s+'\.\./components/FloatingSocialButtons';\r?\n)", "`$1import BenefitsSection from '../components/BenefitsSection';`r`n"
  } else {
    # Fallback: insert after ProductCard import
    $content = $content -replace "(import\s+ProductCard\s+from\s+'\.\./components/ProductCard';\r?\n)", "`$1import BenefitsSection from '../components/BenefitsSection';`r`n"
  }
}

# 2) Insert component after the closing of the last </section> before the outer </div>
# We will replace the first occurrence of </section> followed by </div> (near the end) only once
$pattern = '</section>\s*\r?\n\s*</div>'
$replacement = "</section>`r`n      <BenefitsSection />`r`n    </div>"

if ($content -match $pattern) {
  $content = [regex]::Replace($content, $pattern, $replacement, 1)
}

Set-Content -Path $homeTsxPath -Value $content -NoNewline
Write-Host "BenefitsSection import and usage inserted successfully."
