source ./env/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@gmail.com', 'Aqswde123@')" | python manage.py shell
python manage.py runserver 0.0.0.0:8000
