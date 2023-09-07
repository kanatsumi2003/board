from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.loginPage, name='login'),
    path('logout', views.logoutUser, name='logout'),
    path('mqtt', views.mqttConfig, name='mqtt'),
    path('mqtt-connect', views.mqttConnect, name='mqtt-connect'),
    path('mqtt-disconnect', views.disconnectMqtt, name='mqtt-disconnect'),
    path('mqtt-connection-check', views.checkMqttConnection, name='mqtt-connection-check'),
    path('network', views.networkConfig, name='network'),
    path('box', views.boxPage, name='box'),
    path('load-boxes', views.loadBoxes, name='load-boxes'),
    path('test-box', views.testBox, name='test-box'),
    path('add-box', views.addBox, name='add-box'),
    path('open-box', views.openBox, name='open-box'),
    path('remove-box', views.removeBox, name='remove-box'),
    path('reset-boxes', views.resetBoxes, name='reset-boxes'),
    path('check-internet', views.check_internet, name='check-internet'),
    path('info', views.information, name='info')
]
