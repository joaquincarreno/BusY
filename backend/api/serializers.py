from rest_framework import serializers
from api.models import GPSRegistry

class GPSRegistrySerializer(serializers.Serializer):
    class Meta:
        model = GPSRegistry
