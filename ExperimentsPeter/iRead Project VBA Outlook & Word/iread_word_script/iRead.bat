@echo off
"%iread%\iRead.exe" /scanandrecognize > %temp%\iread_temp_ocr.txt
start winword.exe "%temp%\iread_temp_ocr.txt"