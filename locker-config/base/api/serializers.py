from rest_framework import serializers

class LockerInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    status = serializers.CharField()


class ApiServerInfoSerializer(serializers.Serializer):
    url = serializers.CharField()
    api_key = serializers.CharField()
    
class InfoSerializer(serializers.Serializer):
    locker_id = serializers.CharField()
    locker_code = serializers.CharField()
    locker_name = serializers.CharField()
    locker_status = serializers.CharField()
    api_host = serializers.CharField()
    api_key = serializers.CharField()

    
class BoxesStatusSerializer(serializers.Serializer):
    closed = serializers.BooleanField()
