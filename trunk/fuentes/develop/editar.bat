if Z%1==Z goto sin_parametros
if exist "c:\Archivos de programa\Notepad++\notepad++.exe" set editor="c:\Archivos de programa\Notepad++\notepad++.exe"
if exist "c:\Program Files (x86)\Notepad++\notepad++.exe" set editor="c:\Program Files (x86)\Notepad++\notepad++.exe"
if exist "c:\Program Files\Notepad++\notepad++.exe" set editor="c:\Program Files\Notepad++\notepad++.exe"
for %%F in (..\alserver\tipox\*%1)          do %editor% %%F
for %%F in (..\alserver\menu\*%1)           do %editor% %%F
for %%F in (..\alserver\almacen\*%1)        do %editor% %%F
for %%F in (..\alserver\agenda\*%1)         do %editor% %%F
goto fin
:sin_parametros
call editar .php
call editar .js
call editar .sql
call editar .manifest
call editar .html
:fin