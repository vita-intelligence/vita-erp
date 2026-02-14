from django.urls import path
from . import views

urlpatterns = [
    # ── Categories ────────────────────────────────────────────────────────────
    # GET  list / POST create
    path('companies/<int:company_id>/categories/', views.CategoryListCreateView.as_view()),
    # GET detail / PATCH update / DELETE
    path('companies/<int:company_id>/categories/<int:category_id>/', views.CategoryDetailView.as_view()),

    # ── Items ─────────────────────────────────────────────────────────────────
    # GET  list / POST create         (?type=raw|bom  &active=true  &category=3)
    path('companies/<int:company_id>/items/', views.ItemListCreateView.as_view()),
    # GET detail / PATCH update / DELETE
    path('companies/<int:company_id>/items/<int:item_id>/', views.ItemDetailView.as_view()),

    # ── Recipes (nested under BOM items) ──────────────────────────────────────
    # GET list / POST create
    path('companies/<int:company_id>/items/<int:item_id>/recipes/', views.RecipeListCreateView.as_view()),
    # GET detail / PATCH update / DELETE
    path('companies/<int:company_id>/items/<int:item_id>/recipes/<int:recipe_id>/', views.RecipeDetailView.as_view()),
]