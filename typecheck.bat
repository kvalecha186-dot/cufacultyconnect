@echo off
cd /d "%~dp0"
npx tsc --noEmit --skipLibCheck 2>&1
