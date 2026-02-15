from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from access.models import Membership
from access.services.permissions import membership_has_perm
from companies.models import Company

from .models import Supplier
from .serializers import SupplierSerializer


# ============================================================================
# MIXIN — same pattern as items app
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
        return Response(SupplierSerializer(supplier).data, status=status.HTTP_201_CREATED)


class SupplierDetailView(CompanyMemberMixin, APIView):
    """
    GET    /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.view
    PATCH  /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.edit
    DELETE /api/suppliers/companies/{company_id}/suppliers/{supplier_id}/   → suppliers.delete
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
        return Response(SupplierSerializer(self.get_supplier()).data)

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
        return Response(SupplierSerializer(supplier).data)

    def delete(self, request, company_id, supplier_id):
        if denied := self.require_perm('suppliers.delete'):
            return denied
        self.get_supplier().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)