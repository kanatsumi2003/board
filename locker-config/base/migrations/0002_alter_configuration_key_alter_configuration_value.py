# Generated by Django 4.2.2 on 2023-07-05 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configuration',
            name='key',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='configuration',
            name='value',
            field=models.CharField(max_length=2000),
        ),
    ]
