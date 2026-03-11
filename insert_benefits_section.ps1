# Insert BenefitsSection import and usage into Home.tsx
$home = "c:\Users\pranj\OneDrive\Desktop\Cursor Projects\e_commerce\maysecret\src\pages\Home.tsx"
$content = Get-Content $home -Raw

# 1) Add import if missing
if ($content -notmatch "BenefitsSection") {
  # insert after other component imports (after ProductCard import if present)
  $content = $content -replace "(import\s+ProductCard\s+from\s+'\.\./components/ProductCard';\r?\n)", "$1import BenefitsSection from '../components/BenefitsSection';`r`n"
}

# 2) Insert component after the Why Choose section closes, before the outer closing div
$pattern = "\n\s*</section>\r?\n\s*</div>"  # closing of the section then outer wrapping div
$replacement = "`n      </section>`n      <BenefitsSection />`n    </div>"

if ($content -match $pattern) {
  $content = [regex]::Replace($content, $pattern, $replacement, 1)
}

# Write back
$content | Set-Content $home -NoNewline
Write-Host "BenefitsSection inserted into Home.tsx"
