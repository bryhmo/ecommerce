@echo off

echo Installing dependencies...
call yarn install

echo Setting up environment files...
copy apps\api\.env.example apps\api\.env.local >nul 2>&1
copy apps\web\.env.example apps\web\.env.local >nul 2>&1

echo.
echo ==================== Setup Complete ====================
echo.
echo To start the development servers, run:
echo   yarn dev
echo.
echo To build for production, run:
echo   yarn build
echo.
echo Make sure you have PostgreSQL running on localhost:5432
echo.
echo API will run on: http://localhost:3001
echo Web will run on: http://localhost:3000
echo.
