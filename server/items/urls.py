from django.urls import path
from . import views

urlpatterns = [

    # ── Units of Measure (global, no company scope) ───────────────────────────
    path('uom/', views.UOMListView.as_view()),

    # ── Categories ────────────────────────────────────────────────────────────
    path('companies/<int:company_id>/categories/',
         views.CategoryListCreateView.as_view()),
    path('companies/<int:company_id>/categories/<int:category_id>/',
         views.CategoryDetailView.as_view()),

    # ── Items ─────────────────────────────────────────────────────────────────
    # GET supports ?type=raw|bom  &active=true|false  &category=<id>
    path('companies/<int:company_id>/items/',
         views.ItemListCreateView.as_view()),
    path('companies/<int:company_id>/items/<int:item_id>/',
         views.ItemDetailView.as_view()),

    # ── Recipes (nested under BOM items) ──────────────────────────────────────
    path('companies/<int:company_id>/items/<int:item_id>/recipes/',
         views.RecipeListCreateView.as_view()),
    path('companies/<int:company_id>/items/<int:item_id>/recipes/<int:recipe_id>/',
         views.RecipeDetailView.as_view()),

    # ── Recipe Lines (granular ingredient management) ─────────────────────────
    path('companies/<int:company_id>/items/<int:item_id>/recipes/<int:recipe_id>/lines/',
         views.RecipeLineListCreateView.as_view()),
    path('companies/<int:company_id>/items/<int:item_id>/recipes/<int:recipe_id>/lines/<int:line_id>/',
         views.RecipeLineDetailView.as_view()),

]