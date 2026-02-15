from django.urls import path
from . import views

urlpatterns = [
    # ── Suppliers ─────────────────────────────────────────────────────────────
    path('companies/<int:company_id>/suppliers/',
         views.SupplierListCreateView.as_view()),
    path('companies/<int:company_id>/suppliers/<int:supplier_id>/',
         views.SupplierDetailView.as_view()),

    # ── Addresses ─────────────────────────────────────────────────────────────
    path('companies/<int:company_id>/suppliers/<int:supplier_id>/addresses/',
         views.SupplierAddressListCreateView.as_view()),
    path('companies/<int:company_id>/suppliers/<int:supplier_id>/addresses/<int:address_id>/',
         views.SupplierAddressDetailView.as_view()),
]