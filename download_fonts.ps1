$fonts = @(
    @("Nunito", "Medium", "nunito"),
    @("Nunito", "SemiBold", "nunito"),
    @("Nunito", "Bold", "nunito"),
    @("Nunito", "ExtraBold", "nunito"),
    @("Nunito", "Black", "nunito"),
    @("Quicksand", "Medium", "quicksand"),
    @("Quicksand", "SemiBold", "quicksand"),
    @("Quicksand", "Bold", "quicksand"),
    @("JetBrainsMono", "Medium", "jetbrainsmono"),
    @("JetBrainsMono", "SemiBold", "jetbrainsmono")
)

foreach ($font in $fonts) {
    $family = $font[0]
    $weight = $font[1]
    $folder = $font[2]
    $url = "https://github.com/google/fonts/raw/main/ofl/$folder/static/$family-$weight.ttf"
    $file = "assets/fonts/$family-$weight.ttf"
    Write-Host "Downloading $url"
    curl.exe -s -L $url -o $file
}

Remove-Item -Path "assets/fonts/Nunito-Variable.ttf" -ErrorAction SilentlyContinue
Remove-Item -Path "assets/fonts/Quicksand-Variable.ttf" -ErrorAction SilentlyContinue
Remove-Item -Path "assets/fonts/JetBrainsMono-Variable.ttf" -ErrorAction SilentlyContinue
