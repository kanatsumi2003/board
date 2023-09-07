from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes),
    path('v1/info', views.getInfo),
    path('v1/check-boxes', views.checkBoxes)
]
