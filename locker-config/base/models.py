from django.db import models
from django.utils.translation import gettext_lazy as _
from .utils import encoder

# Create your models here.
class Configuration(models.Model):
    
    class ConfigGroup(models.TextChoices):
        MQTT = "MQTT", _("MQTT")
        SERVER = "SERVER", _("SERVER")
        NETWORK = "NETWORK", _("NETWORK")
        LOCKER = "LOCKER", _("LOCKER")
    
    key = models.CharField(unique=True, max_length=100)
    value = models.CharField(max_length=2000)
    group = models.CharField(max_length=50, choices=ConfigGroup.choices)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f"{self.key}={self.value}"

class Box(models.Model):
    number = models.IntegerField(unique=True)
    board_no = models.IntegerField()
    pin = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    
class Setting(models.Model):
    key = models.CharField(unique=True, max_length=100)
    value = models.JSONField(encoder=encoder.EnhancedJSONEncoder)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

