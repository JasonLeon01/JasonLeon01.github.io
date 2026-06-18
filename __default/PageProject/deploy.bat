@echo off
setlocal enabledelayedexpansion

set "ROOT=%~dp0..\.."

echo Removing dist\ folder...
rd /s /q "%~dp0dist"

echo Building...
call npm run build

echo Cleaning %ROOT% (keeping .git, .github, __default, .gitattributes)...

for /f "delims=" %%i in ('dir /b "%ROOT%"') do (
    set "ITEM=%%i"
    if /i not "%%i"==".git" (
        if /i not "%%i"==".github" (
            if /i not "%%i"=="__default" (
                if /i not "%%i"==".gitattributes" (
                    if exist "%ROOT%\%%i\" (
                        rd /s /q "%ROOT%\%%i"
                    ) else (
                        del /q "%ROOT%\%%i"
                    )
                )
            )
        )
    )
)

echo Copying dist\ to %ROOT%...
xcopy /e /i /y "%~dp0dist\*" "%ROOT%\"

echo Removing dist\ folder...
rd /s /q "%~dp0dist"

echo Done.
endlocal
pause
