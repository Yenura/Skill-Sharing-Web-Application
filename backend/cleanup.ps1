# PowerShell script to cleanup and consolidate the project structure

Write-Host "Starting project structure cleanup..." -ForegroundColor Green

# 1. Fix SearchService duplicate
Write-Host "Fixing duplicate SearchService..." -ForegroundColor Yellow
if (Test-Path "src\main\java\com\example\pafbackend\service\SearchService.java") {
    Remove-Item "src\main\java\com\example\pafbackend\service\SearchService.java" -Force
    Write-Host "Removed duplicate SearchService from service directory" -ForegroundColor Green
}

# 2. Consolidate directories
$consolidatePairs = @(
    @{Source = "src\main\java\com\example\pafbackend\service"; Target = "src\main\java\com\example\pafbackend\services"},
    @{Source = "src\main\java\com\example\pafbackend\repository"; Target = "src\main\java\com\example\pafbackend\repositories"},
    @{Source = "src\main\java\com\example\pafbackend\controller"; Target = "src\main\java\com\example\pafbackend\controllers"},
    @{Source = "src\main\java\com\example\pafbackend\model"; Target = "src\main\java\com\example\pafbackend\models"}
)

foreach ($pair in $consolidatePairs) {
    $source = $pair.Source
    $target = $pair.Target
    
    Write-Host "Consolidating $source into $target..." -ForegroundColor Yellow
    
    if (Test-Path $source) {
        # Move files from source to target
        $files = Get-ChildItem -Path $source -File
        
        foreach ($file in $files) {
            $targetFilePath = Join-Path -Path $target -ChildPath $file.Name
            
            if (Test-Path $targetFilePath) {
                Write-Host "Warning: File $($file.Name) already exists in target. Skipping..." -ForegroundColor Yellow
            } else {
                Move-Item -Path $file.FullName -Destination $target -Force
                Write-Host "Moved $($file.Name) to $target" -ForegroundColor Green
            }
        }
        
        # Remove empty source directory
        if ((Get-ChildItem -Path $source).Count -eq 0) {
            Remove-Item -Path $source -Force
            Write-Host "Removed empty directory $source" -ForegroundColor Green
        } else {
            Write-Host "Directory $source still contains items and was not removed" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Source directory $source not found. Skipping..." -ForegroundColor Yellow
    }
}

# 3. Fix application.properties conflicts
Write-Host "Fixing application properties conflicts..." -ForegroundColor Yellow
if (Test-Path "src\main\resources\application.properties") {
    Rename-Item -Path "src\main\resources\application.properties" -NewName "application.properties.backup" -Force
    Write-Host "Renamed application.properties to application.properties.backup" -ForegroundColor Green
}

Write-Host "Project structure cleanup complete!" -ForegroundColor Green 