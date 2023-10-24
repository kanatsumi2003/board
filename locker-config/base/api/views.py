from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import InfoSerializer, BoxesStatusSerializer
from ..services import SettingService
from .. import constants 
from ..utils import board
import logging 
import random

@api_view(["GET"])
def getRoutes(request):
    routes = [
        'GET /api',
        'GET /api/v1/info',
        'GET /api/v1/check-boxes'
    ]
    return Response(routes, status=status.HTTP_200_OK)


@api_view(["GET"])
def getInfo(request):
    try:
        settings = SettingService.get_settings(key=constants.LOCKER_INFO_SETTING_KEY)
        if settings is None:
            return Response("Info configuration was not commpleted", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = InfoSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as ex:
        return Response(f"Internal server error: {ex} " , status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["GET"])
def checkBoxes(request):
    try: 
        closed = board.check_boxes_closed();
        serializer = BoxesStatusSerializer({
            "closed": closed
        })
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as ex:
        # return Response(f"Interal server error: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR);   
        
        # Testing version
        serializer = BoxesStatusSerializer({
            "closed": bool(random.getrandbits(1))  
        })
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
