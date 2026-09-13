@echo off
setlocal

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "PROJECT=%ROOT%\__default\PageProject"

if exist "%ROOT%\assets" rd /s /q "%ROOT%\assets"
if exist "%ROOT%\.nojekyll" del /q "%ROOT%\.nojekyll"
if exist "%ROOT%\404.html" del /q "%ROOT%\404.html"
if exist "%ROOT%\favicon.ico" del /q "%ROOT%\favicon.ico"
if exist "%ROOT%\icons.ico" del /q "%ROOT%\icons.ico"
if exist "%ROOT%\index.html" del /q "%ROOT%\index.html"

pushd "%PROJECT%"
call npm run build
if errorlevel 1 (
    popd
    exit /b 1
)
popd

xcopy /e /i /y /h "%PROJECT%\dist\*" "%ROOT%\"
if errorlevel 1 exit /b 1

echo Done.
endlocal
