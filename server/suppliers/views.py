from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from access.models import Membership
from access.services.permissions import membership_has_perm
from companies.models import Company

from .models import Supplier, SupplierAddress
from .serializers import (
    SupplierSerializer,
    SupplierDetailSerializer,
    SupplierAddressSerializer,
)


# ============================================================================
# MIXIN
# ============================================================================

class CompanyMemberMixin:
    def get_company(self):
        if not hasattr(self, '_company'):
            self._company = get_object_or_404(Company, id=self.kwargs['company_id'])
        return self._company

    def get_membership(self):
        if not hasattr(self, '_membership'):
            self._membership = get_object_or_404(
                Membership,
                user=self.request.user,
                company=self.get_company(),
                is_active=True,
            )
        return self._membership

    def require_perm(self, perm: str):
        if not membership_has_perm(self.get_membership(), perm):
            return Response(
                {'detail': f'Missing permission: {perm}'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None


# ============================================================================
# SUPPLIERS
# ============================================================================

class SupplierListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/suppliers/companies/{company_id}/suppliers/   → suppliers.view
    POST /api/suppliers/companies/{company_id}/suppliers/   → suppliers.create

    GET query params:
        ?search=<name>
        ?active=true|false
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        if denied := self.require_perm('suppliers.view'):
            return denied

        qs = Supplier.objects.filter(company=self.get_company())

        search    = request.query_params.get('search', '').strip()
        is_active = request.query_params.get('active')

        if search:
            qs = qs.filter(name__icontains=search)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')

        return Response(SupplierSerializer(qs, many=True).data)

    def post(self, request, company_id):
        if denied := self.require_perm('suppliers.create'):
            return denied

        name = request.data.get('name', '').strip()

        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        company = self.get_company()

        if Supplier.objects.filter(company=company, name=name).exists():
            return Response(
                {'detail': f'Supplier "{name}" already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        supplier = Supplier.objects.create(
            company=company,
            name=name,
            description=request.data.get('description', ''),
            is_active=request.data.get('is_active', True),
        )
        return Response(SupplierDetailSerializer(supplier).data, status=status.HTTP_201_CREATED)


class SupplierDetailView(CompanyMemberMixin, APIView):
    """
    GET    /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.view
    PATCH  /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.edit
    DELETE /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.delete
    """
    permission_classes = [IsAuthenticated]

    def get_supplier(self):
        return get_object_or_404(
            Supplier.objects.prefetch_related('addresses'),
            id=self.kwargs['supplier_id'],
            company=self.get_company(),
        )

    def get(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.view'):
            return denied
        return Response(SupplierDetailSerializer(self.get_supplier()).data)

    def patch(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.edit'):
            return denied

        supplier = self.get_supplier()
        name     = request.data.get('name', '').strip()

        if name and name != supplier.name:
            if Supplier.objects.filter(company=self.get_company(), name=name).exists():
                return Response(
                    {'detail': f'Supplier "{name}" already exists.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            supplier.name = name

        if 'description' in request.data:
            supplier.description = request.data['description']
        if 'is_active' in request.data:
            supplier.is_active = request.data['is_active']

        supplier.save()
        return Response(SupplierDetailSerializer(supplier).data)

    def delete(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.delete'):
            return denied
        self.get_supplier().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# SUPPLIER ADDRESSES
# ============================================================================

class SupplierAddressListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/addresses/   → suppliers.view
    POST /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/addresses/   → suppliers.edit
    """
    permission_classes = [IsAuthenticated]

    def get_supplier(self):
        return get_object_or_404(
            Supplier,
            id=self.kwargs['supplier_id'],
            company=self.get_company(),
        )

    def get(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.view'):
            return denied
        addresses = self.get_supplier().addresses.all()
        return Response(SupplierAddressSerializer(addresses, many=True).data)

    def post(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.edit'):
            return denied

        supplier    = self.get_supplier()
        address_type = request.data.get('address_type', 'headquarters')
        is_primary  = request.data.get('is_primary', False)

        # Validate address_type
        valid_types = [t[0] for t in SupplierAddress.ADDRESS_TYPES]
        if address_type not in valid_types:
            return Response(
                {'detail': f'address_type must be one of: {valid_types}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate coordinates — must provide both or neither
        latitude  = request.data.get('latitude')
        longitude = request.data.get('longitude')
        if (latitude is None) != (longitude is None):
            return Response(
                {'detail': 'Provide both latitude and longitude or neither.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If setting as primary, unset all others first
        if is_primary:
            supplier.addresses.filter(is_primary=True).update(is_primary=False)

        address = SupplierAddress.objects.create(
            supplier=supplier,
            label=request.data.get('label', '').strip(),
            address_type=address_type,
            street=request.data.get('street', '').strip(),
            city=request.data.get('city', '').strip(),
            state=request.data.get('state', '').strip(),
            postal_code=request.data.get('postal_code', '').strip(),
            country=request.data.get('country', '').strip(),
            latitude=latitude,
            longitude=longitude,
            is_primary=is_primary,
        )
        return Response(SupplierAddressSerializer(address).data, status=status.HTTP_201_CREATED)


class SupplierAddressDetailView(CompanyMemberMixin, APIView):
    """
    PATCH  /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/addresses/{address_id}/  → suppliers.edit
    DELETE /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/addresses/{address_id}/  → suppliers.edit
    """
    permission_classes = [IsAuthenticated]

    def get_address(self):
        return get_object_or_404(
            SupplierAddress,
            id=self.kwargs['address_id'],
            supplier__id=self.kwargs['supplier_id'],
            supplier__company=self.get_company(),
        )

    def patch(self, request, company_id, supplier_id, address_id):
        if denied := self.require_perm('suppliers.edit'):
            return denied

        address = self.get_address()

        # Validate address_type if provided
        if 'address_type' in request.data:
            valid_types = [t[0] for t in SupplierAddress.ADDRESS_TYPES]
            if request.data['address_type'] not in valid_types:
                return Response(
                    {'detail': f'address_type must be one of: {valid_types}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            address.address_type = request.data['address_type']

        # Validate coordinates — must provide both or neither
        has_lat = 'latitude'  in request.data
        has_lng = 'longitude' in request.data
        if has_lat != has_lng:
            return Response(
                {'detail': 'Provide both latitude and longitude or neither.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Simple field updates
        for field in ['label', 'street', 'city', 'state', 'postal_code', 'country']:
            if field in request.data:
                setattr(address, field, request.data[field].strip())

        if has_lat:
            address.latitude  = request.data['latitude']
            address.longitude = request.data['longitude']

        # If promoting to primary, demote all others first
        if request.data.get('is_primary'):
            address.supplier.addresses.filter(is_primary=True).update(is_primary=False)
            address.is_primary = True
        elif 'is_primary' in request.data:
            address.is_primary = request.data['is_primary']

        address.save()
        return Response(SupplierAddressSerializer(address).data)

    def delete(self, request, company_id, supplier_id, address_id):
        if denied := self.require_perm('suppliers.edit'):
            return denied
        self.get_address().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)