from django.urls import path
from . import views

urlpatterns = [
    path('companies/<int:company_id>/suppliers/', views.SupplierListCreateView.as_view()),
    path('companies/<int:company_id>/suppliers/<int:supplier_id>/', views.SupplierDetailView.as_view()),
]