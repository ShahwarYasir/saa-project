@echo off
set PHP_EXE=D:\xamp\php\php.exe

if not exist "%PHP_EXE%" (
  echo PHP was not found at %PHP_EXE%.
  echo Update PHP_EXE in this file or add php.exe to PATH.
  pause
  exit /b 1
)

cd /d "%~dp0"
echo Starting SAA PHP API at http://127.0.0.1:8000/api
echo Keep this window open while testing the frontend.
"%PHP_EXE%" -S 127.0.0.1:8000 router.php
