@echo off
cd /d "%~dp0"
echo Starting SAA React frontend at http://localhost:5173
echo Make sure the backend is running at http://127.0.0.1:8000/api
npm.cmd run dev
