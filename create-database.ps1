# PowerShell Script to Create MySQL Database
# Usage: .\create-database.ps1

Write-Host "🗄️  Creating MySQL Database..." -ForegroundColor Cyan

# Configuration - غيّر هذه القيم
$mysqlPath = "mysql"  # أو المسار الكامل: "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$username = "root"
$password = Read-Host "Enter MySQL password for '$username'" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
$database = "delta_steel"

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Database: $database" -ForegroundColor Gray
Write-Host "   Username: $username" -ForegroundColor Gray
Write-Host "   Host: localhost:3306" -ForegroundColor Gray

# Create database query
$query = @"
CREATE DATABASE IF NOT EXISTS $database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"@

Write-Host "`n🔄 Creating database..." -ForegroundColor Yellow

try {
    # Try to execute MySQL command
    $result = & $mysqlPath -u $username -p$passwordPlain -e $query 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Database '$database' created successfully!" -ForegroundColor Green
        Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Create backend/.env file with:" -ForegroundColor Gray
        Write-Host "      DATABASE_URL=`"mysql://$username`:YOUR_PASSWORD@localhost:3306/$database`"" -ForegroundColor White
        Write-Host "`n   2. Run:" -ForegroundColor Gray
        Write-Host "      cd backend" -ForegroundColor White
        Write-Host "      npx prisma generate" -ForegroundColor White
        Write-Host "      npx prisma db push" -ForegroundColor White
    } else {
        Write-Host "`n❌ Failed to create database" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
        Write-Host "`n💡 Tips:" -ForegroundColor Yellow
        Write-Host "   - Make sure MySQL is running" -ForegroundColor Gray
        Write-Host "   - Check username and password" -ForegroundColor Gray
        Write-Host "   - Try: net start MySQL80" -ForegroundColor Gray
    }
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host "`n💡 Make sure MySQL is installed and in PATH" -ForegroundColor Yellow
    Write-Host "   Or use full path: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ForegroundColor Gray
}

# Clear password from memory
$passwordPlain = $null

