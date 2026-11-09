@echo off
cd /d "%~dp0"
where python >nul 2>nul && (python otimizar-imagens.py & goto :eof)
where py >nul 2>nul && (py otimizar-imagens.py & goto :eof)
echo Python nao encontrado. Instale em https://www.python.org/downloads/ (marque "Add Python to PATH") e rode de novo.
pause
