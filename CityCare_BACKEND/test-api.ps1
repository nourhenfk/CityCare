# CityCare API Test Script
# Run the server first with: npm start
# Then run this script in another terminal

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "      CityCare API Tests" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$global:token = $null

# Test 1: Health Check
Write-Host "`n📍 Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET /" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 2: Register User
Write-Host "`n📍 Test 2: Register User" -ForegroundColor Yellow
Write-Host "POST /api/auth/register" -ForegroundColor Gray
$registerBody = @{
    name = "Test User"
    email = "test@citycare.com"
    password = "test123"
    phone = "+212612345678"
    role = "ROLE_USER"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "⚠️  User may already exist or error occurred" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

# Test 3: Login
Write-Host "`n📍 Test 3: Login User" -ForegroundColor Yellow
Write-Host "POST /api/auth/login" -ForegroundColor Gray
$loginBody = @{
    email = "test@citycare.com"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $global:token = $response.data.token
    Write-Host "Token: $($global:token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

# Test 4: Get Current User
if ($global:token) {
    Write-Host "`n📍 Test 4: Get Current User Profile" -ForegroundColor Yellow
    Write-Host "GET /api/auth/me" -ForegroundColor Gray
    try {
        $headers = @{
            Authorization = "Bearer $global:token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers
        Write-Host "✅ Profile retrieved!" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3)
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
    }

    # Test 5: Get Reports
    Write-Host "`n📍 Test 5: Get All Reports" -ForegroundColor Yellow
    Write-Host "GET /api/reports" -ForegroundColor Gray
    try {
        $headers = @{
            Authorization = "Bearer $global:token"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/api/reports" -Method GET -Headers $headers
        Write-Host "✅ Reports retrieved!" -ForegroundColor Green
        Write-Host "Total reports: $($response.total)" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 3)
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  No token available, skipping authenticated tests" -ForegroundColor Yellow
}

# Test 6: Register Admin
Write-Host "`n📍 Test 6: Register Admin User" -ForegroundColor Yellow
Write-Host "POST /api/auth/register" -ForegroundColor Gray
$adminBody = @{
    name = "Admin User"
    email = "admin@citycare.com"
    password = "admin123"
    phone = "+212612345679"
    role = "ROLE_ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $adminBody -ContentType "application/json"
    Write-Host "✅ Admin registered successfully!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "⚠️  Admin may already exist or error occurred" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
}

# Test 7: Test Invalid Login
Write-Host "`n📍 Test 7: Test Invalid Login (Should Fail)" -ForegroundColor Yellow
Write-Host "POST /api/auth/login" -ForegroundColor Gray
$badLoginBody = @{
    email = "test@citycare.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $badLoginBody -ContentType "application/json"
    Write-Host "❌ This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected invalid password!" -ForegroundColor Green
}

# Test 8: Test Protected Route Without Token
Write-Host "`n📍 Test 8: Test Protected Route Without Token (Should Fail)" -ForegroundColor Yellow
Write-Host "GET /api/auth/me" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET
    Write-Host "❌ This should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected request without token!" -ForegroundColor Green
}

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "      All Tests Completed!" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
