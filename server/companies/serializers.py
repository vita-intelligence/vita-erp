from rest_framework import serializers
from .models import Company


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "description", "date_created"]
        read_only_fields = ["id", "date_created"]
    
    def to_representation(self, instance):
        """
        Ensure the response includes the ID after creation
        """
        representation = super().to_representation(instance)
        return representation


class CompanyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name", "description", "date_created"]