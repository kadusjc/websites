@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Otimizando as imagens do site Teodoro Prime Garden...
where py >nul 2>nul && (py otimizar-imagens.py %*) || (python otimizar-imagens.py %*)
if errorlevel 1 echo. & echo Precisa do Python instalado: https://www.python.org/downloads/ (marque "Add to PATH")
pause
