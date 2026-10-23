@echo off
node "%~dp0build_page.mjs" %*
exit /b %errorlevel%
