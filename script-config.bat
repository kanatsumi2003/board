set locker_config_dir="locker-config"

@REM @REM START LOCKER CONFIG APP
cd %locker_config_dir%

python -m venv env

call .\env\Scripts\activate.bat
 
pip install -r requirements.txt

python manage.py migrate

echo from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@gmail.com', 'Aqswde123@') | python manage.py shell

python  -d manage.py runserver 0.0.0.0:8000 --noreload
