from django.contrib import admin

# Register your models here.
from .models import Configuration, Box, Setting

admin.site.register(Configuration)

admin.site.register(Box)

admin.site.register(Setting)
