from rest_framework import serializers
from .models import Supplier, SupplierAddress


# ============================================================================
# SUPPLIER ADDRESS
# ============================================================================

class SupplierAddressSerializer(serializers.ModelSerializer):
    address_type_display = serializers.CharField(
        source='get_address_type_display', read_only=True
    )

    class Meta:
        model = SupplierAddress
        fields = [
            'id',
            'label',
            'address_type',
            'address_type_display',
            'street',
            'city',
            'state',
            'postal_code',
            'country',
            'latitude',
            'longitude',
            'is_primary',
        ]


# ============================================================================
# SUPPLIER
# ============================================================================

class SupplierSerializer(serializers.ModelSerializer):
    """Lightweight — used in list views."""
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'description', 'is_active', 'date_added']
        read_only_fields = ['date_added']


class SupplierDetailSerializer(serializers.ModelSerializer):
    """Full supplier — includes embedded addresses."""
    addresses = SupplierAddressSerializer(many=True, read_only=True)

    class Meta:
        model = Supplier
        fields = ['id', 'name', 'description', 'is_active', 'date_added', 'addresses']
        read_only_fields = ['date_added']