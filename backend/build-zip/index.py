import json
import io
import zipfile
import base64


def handler(event: dict, context) -> dict:
    '''
    Собирает ZIP-архив с установщиком DateFix, деинсталлятором и инструкцией.
    Возвращает архив в формате base64 для скачивания на фронтенде.
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    install_bat = (
        '@echo off\r\n'
        'chcp 65001 >nul\r\n'
        'title DateFix - ustanovshik\r\n'
        '\r\n'
        'net session >nul 2>&1\r\n'
        'if %errorLevel% neq 0 (\r\n'
        '    echo.\r\n'
        '    echo  [!] Zapustite fayl ot imeni Administratora:\r\n'
        '    echo      praviy klik -^> "Zapusk ot imeni administratora"\r\n'
        '    echo.\r\n'
        '    pause\r\n'
        '    exit /b 1\r\n'
        ')\r\n'
        '\r\n'
        'echo.\r\n'
        'echo  ============================================\r\n'
        'echo            Ustanovka DateFix\r\n'
        'echo  ============================================\r\n'
        'echo.\r\n'
        '\r\n'
        'set "INSTALL_DIR=C:\\DateFix"\r\n'
        'if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"\r\n'
        'echo  [1/4] Papka sozdana: %INSTALL_DIR%\r\n'
        '\r\n'
        'set "PS_SCRIPT=%INSTALL_DIR%\\DateFix.ps1"\r\n'
        '> "%PS_SCRIPT%" echo $targetDate = Get-Date -Year 2026 -Month 3 -Day 1\r\n'
        '>>"%PS_SCRIPT%" echo Set-Date -Date $targetDate\r\n'
        'echo  [2/4] Skript daty sozdan\r\n'
        '\r\n'
        'sc config W32Time start= disabled >nul 2>&1\r\n'
        'net stop W32Time >nul 2>&1\r\n'
        'echo  [3/4] Sinhronizaciya vremeni otklyuchena\r\n'
        '\r\n'
        'schtasks /create /tn "DateFix" /tr "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \\"%PS_SCRIPT%\\"" /sc onstart /ru "SYSTEM" /rl HIGHEST /f >nul\r\n'
        'echo  [4/5] Dobavleno v avtozagruzku Windows\r\n'
        '\r\n'
        'schtasks /create /tn "DateFix-Shutdown" /tr "shutdown.exe /s /f /t 0" /sc daily /st 23:30 /ru "SYSTEM" /rl HIGHEST /f >nul\r\n'
        'echo  [5/5] Vyklyuchenie v 23:30 dobavleno\r\n'
        '\r\n'
        'echo.\r\n'
        'echo  ============================================\r\n'
        'echo   Gotovo! Data 1 marta 2026 budet stavitsya\r\n'
        'echo   pri kazhdom vklyuchenii. Vyklyuchenie v 23:30.\r\n'
        'echo  ============================================\r\n'
        'echo.\r\n'
        '\r\n'
        'choice /c YN /m "Ustanovit datu 1 marta 2026 seychas"\r\n'
        'if errorlevel 2 goto end\r\n'
        'powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"\r\n'
        'echo  Data ustanovlena.\r\n'
        '\r\n'
        ':end\r\n'
        'echo.\r\n'
        'pause\r\n'
    )

    uninstall_bat = (
        '@echo off\r\n'
        'chcp 65001 >nul\r\n'
        'net session >nul 2>&1 || (echo Zapustite ot Administratora & pause & exit /b)\r\n'
        '\r\n'
        'schtasks /delete /tn "DateFix" /f >nul 2>&1\r\n'
        'schtasks /delete /tn "DateFix-Shutdown" /f >nul 2>&1\r\n'
        'rmdir /s /q "C:\\DateFix" 2>nul\r\n'
        '\r\n'
        'sc config W32Time start= auto >nul 2>&1\r\n'
        'net start W32Time >nul 2>&1\r\n'
        'w32tm /resync >nul 2>&1\r\n'
        '\r\n'
        'echo DateFix udalen. Sinhronizaciya vremeni vosstanovlena.\r\n'
        'pause\r\n'
    )

    readme = (
        'DateFix - установка системной даты Windows 11 на 1 марта 2026\r\n'
        '============================================================\r\n'
        '\r\n'
        'СОДЕРЖИМОЕ АРХИВА:\r\n'
        '  - Установить-DateFix.bat  — установка и добавление в автозагрузку\r\n'
        '  - Удалить-DateFix.bat     — полное удаление\r\n'
        '  - README.txt              — эта инструкция\r\n'
        '\r\n'
        'КАК УСТАНОВИТЬ:\r\n'
        '  1. Правый клик по "Установить-DateFix.bat"\r\n'
        '  2. Выберите "Запуск от имени администратора"\r\n'
        '  3. Следуйте подсказкам на экране\r\n'
        '\r\n'
        'ЧТО ДЕЛАЕТ УСТАНОВЩИК:\r\n'
        '  - создаёт папку C:\\DateFix со скриптом\r\n'
        '  - отключает интернет-синхронизацию времени (чтобы дата не сбрасывалась)\r\n'
        '  - добавляет запуск при включении ПК через Планировщик задач\r\n'
        '  - добавляет ежедневное выключение компьютера в 23:30\r\n'
        '  - при желании сразу ставит дату 1 марта 2026\r\n'
        '\r\n'
        'КАК УДАЛИТЬ:\r\n'
        '  Запустите "Удалить-DateFix.bat" от имени администратора.\r\n'
        '  Он удалит все файлы, задачу автозагрузки и восстановит\r\n'
        '  синхронизацию времени.\r\n'
        '\r\n'
        'ВАЖНО:\r\n'
        '  - Требуются права администратора.\r\n'
        '  - После отключения синхронизации Windows не будет менять дату сам.\r\n'
    )

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('Установить-DateFix.bat', install_bat.encode('utf-8'))
        zf.writestr('Удалить-DateFix.bat', uninstall_bat.encode('utf-8'))
        zf.writestr('README.txt', readme.encode('utf-8'))

    zip_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'filename': 'DateFix.zip',
            'data': zip_b64,
        }),
    }