# DeepResearch Development Environment Startup Script
param(
    [string]$Service = "all"
)

Write-Host "DeepResearch Development Environment Startup Script" -ForegroundColor Green

switch ($Service.ToLower()) {
    "frontend" {
        Write-Host "Starting frontend development server..." -ForegroundColor Yellow
        Set-Location frontend
        npm run dev
    }
    "backend" {
        Write-Host "Starting backend development server..." -ForegroundColor Yellow
        Set-Location backend
        langgraph dev
    }
    "all" {
        Write-Host "Starting both frontend and backend development servers..." -ForegroundColor Yellow
        
        # Start backend
        Write-Host "Starting backend service..." -ForegroundColor Cyan
        Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd backend; langgraph dev" -WindowStyle Normal
        
        # Wait 2 seconds
        Start-Sleep -Seconds 2
        
        # Start frontend
        Write-Host "Starting frontend service..." -ForegroundColor Cyan
        Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd frontend; npm run dev" -WindowStyle Normal
        
        Write-Host "Services started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:5173/" -ForegroundColor Blue
        Write-Host "Backend: http://localhost:2024" -ForegroundColor Blue
    }
    default {
        Write-Host "Invalid service parameter: $Service" -ForegroundColor Red
        Write-Host "Available parameters: all, frontend, backend" -ForegroundColor Yellow
    }
}