@echo off
REM DeepResearch Development Environment Startup Script
echo DeepResearch Development Environment Startup Script

if "%1"=="frontend" (
    echo Starting frontend development server...
    cd frontend
    npm run dev
    goto :eof
)

if "%1"=="backend" (
    echo Starting backend development server...
    cd backend
    langgraph dev
    goto :eof
)

if "%1"=="all" (
    echo Starting both frontend and backend development servers...
    
    echo Starting backend service...
    start "Backend" cmd /k "cd backend && langgraph dev"
    
    timeout /t 3 /nobreak >nul
    
    echo Starting frontend service...
    start "Frontend" cmd /k "cd frontend && npm run dev"
    
    echo Services started!
    echo Frontend: http://localhost:5173/
    echo Backend: http://localhost:2024
    goto :eof
)

echo Invalid service parameter: %1
echo Available parameters: all, frontend, backend
echo.
echo Usage:
echo   start-dev.bat all       - Start all services
echo   start-dev.bat frontend  - Start frontend only
echo   start-dev.bat backend   - Start backend only