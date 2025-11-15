@echo off
echo Starting AI Blog Generator Server...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting server on port 3001...
echo You can test it at: http://localhost:3001/health
echo.
node server/index.js
pause
