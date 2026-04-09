# PowerShell script to fix CSS imports back to original Spanish names

$cssReplacements = @{
    "bookAppointment.css" = "sacarturno.css"
    "patientAppointments.css" = "verTurnos.css"
    "appointmentCard.css" = "tarjetaturno.css"
}

# Get all .js and .jsx files
$files = Get-ChildItem -Path "src" -Include "*.js", "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($old in $cssReplacements.Keys) {
        $new = $cssReplacements[$old]
        $content = $content -replace [regex]::Escape($old), $new
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Fixed CSS imports in: $($file.FullName)"
    }
}

Write-Host "CSS import fixes completed!"
