from django.urls import path
from .views import CompanyCreateView, MyCompaniesListView

urlpatterns = [
    path("", CompanyCreateView.as_view(), name="company-create"),
    path("me/", MyCompaniesListView.as_view(), name="my-companies"),
]