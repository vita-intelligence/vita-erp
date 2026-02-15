from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from access.models import Membership
from companies.models import Company
from access.services.permissions import membership_has_perm

from .models import Category, Item, Recipe, RecipeLine, UnitOfMeasure
from .serializers import (
    CategorySerializer,
    ItemSerializer,
    ItemDetailSerializer,
    RecipeSerializer,
    RecipeDetailSerializer,
    RecipeLineSerializer,
    UOMSerializer,
)


# ============================================================================
# MIXIN
# ============================================================================

class CompanyMemberMixin:
    """
    Resolves company + requester membership from URL kwargs.
    Raises 404 if the company doesn't exist or the user is not an active member.
    """

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
        """Returns 403 Response if lacking permission. Use inside APIView methods."""
        if not membership_has_perm(self.get_membership(), perm):
            return Response(
                {'detail': f'Missing permission: {perm}'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    def check_perm(self, perm: str):
        """Raises PermissionDenied if lacking permission. Use inside get_queryset."""
        if not membership_has_perm(self.get_membership(), perm):
            raise PermissionDenied(f'Missing permission: {perm}')


# ============================================================================
# UNITS OF MEASURE
# ============================================================================

class UOMListView(APIView):
    """
    GET /api/items/uom/
    Global read-only list — no company scoping needed, UOMs are shared system-wide.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UOMSerializer(UnitOfMeasure.objects.all(), many=True).data)


# ============================================================================
# CATEGORIES
# ============================================================================

class CategoryListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/items/companies/{company_id}/categories/   → items.view
    POST /api/items/companies/{company_id}/categories/   → items.create
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        if denied := self.require_perm('items.view'):
            return denied
        categories = Category.objects.filter(company=self.get_company())
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request, company_id):
        if denied := self.require_perm('items.create'):
            return denied

        name = request.data.get('name', '').strip()
        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        company = self.get_company()
        if Category.objects.filter(company=company, name=name).exists():
            return Response(
                {'detail': f'Category "{name}" already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        category = Category.objects.create(company=company, name=name)
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)


class CategoryDetailView(CompanyMemberMixin, APIView):
    """
    GET    /api/items/companies/{company_id}/categories/{category_id}/   → items.view
    PATCH  /api/items/companies/{company_id}/categories/{category_id}/   → items.edit
    DELETE /api/items/companies/{company_id}/categories/{category_id}/   → items.delete
    """
    permission_classes = [IsAuthenticated]

    def get_category(self):
        return get_object_or_404(Category, id=self.kwargs['category_id'], company=self.get_company())

    def get(self, request, company_id, category_id):
        if denied := self.require_perm('items.view'):
            return denied
        return Response(CategorySerializer(self.get_category()).data)

    def patch(self, request, company_id, category_id):
        if denied := self.require_perm('items.edit'):
            return denied

        category = self.get_category()
        name = request.data.get('name', '').strip()

        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if name != category.name and Category.objects.filter(company=self.get_company(), name=name).exists():
            return Response(
                {'detail': f'Category "{name}" already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        category.name = name
        category.save(update_fields=['name'])
        return Response(CategorySerializer(category).data)

    def delete(self, request, company_id, category_id):
        if denied := self.require_perm('items.delete'):
            return denied
        self.get_category().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# ITEMS
# ============================================================================

class ItemListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/items/companies/{company_id}/items/   → items.view
    POST /api/items/companies/{company_id}/items/   → items.create

    GET query params:
        ?type=raw|bom
        ?active=true|false
        ?category=<id>
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        if denied := self.require_perm('items.view'):
            return denied

        qs = (
            Item.objects
            .filter(company=self.get_company())
            .select_related('unit_of_measurement', 'category')
        )

        item_type = request.query_params.get('type')
        is_active = request.query_params.get('active')
        category  = request.query_params.get('category')
        search = request.query_params.get('search', '').strip()

        if search:
            qs = qs.filter(name__icontains=search)
        if item_type in ('raw', 'bom'):
            qs = qs.filter(item_type=item_type)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        if category:
            qs = qs.filter(category_id=category)

        return Response(ItemSerializer(qs, many=True).data)

    def post(self, request, company_id):
        if denied := self.require_perm('items.create'):
            return denied

        name        = request.data.get('name', '').strip()
        uom_id      = request.data.get('unit_of_measurement')
        item_type   = request.data.get('item_type', 'raw')
        category_id = request.data.get('category')
    
        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not uom_id:
            return Response({'detail': 'unit_of_measurement is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if item_type not in ('raw', 'bom'):
            return Response({'detail': 'item_type must be "raw" or "bom".'}, status=status.HTTP_400_BAD_REQUEST)

        company = self.get_company()

        # Prevent cross-company category assignment
        if category_id and not Category.objects.filter(id=category_id, company=company).exists():
            return Response({'detail': 'Category not found in this company.'}, status=status.HTTP_400_BAD_REQUEST)

        if Item.objects.filter(company=company, name=name).exists():
            return Response(
                {'detail': f'Item "{name}" already exists in this company.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item = Item.objects.create(
            company=company,
            name=name,
            description=request.data.get('description', ''),
            item_type=item_type,
            unit_of_measurement_id=uom_id,
            category_id=category_id,
        )
        return Response(ItemDetailSerializer(item).data, status=status.HTTP_201_CREATED)


class ItemDetailView(CompanyMemberMixin, APIView):
    """
    GET    /api/items/companies/{company_id}/items/{item_id}/   → items.view
    PATCH  /api/items/companies/{company_id}/items/{item_id}/   → items.edit
    DELETE /api/items/companies/{company_id}/items/{item_id}/   → items.delete
    """
    permission_classes = [IsAuthenticated]

    def get_item(self):
        return get_object_or_404(
            Item.objects.select_related('unit_of_measurement', 'category')
                        .prefetch_related('recipes'),
            id=self.kwargs['item_id'],
            company=self.get_company(),
        )

    def get(self, request, company_id, item_id):
        if denied := self.require_perm('items.view'):
            return denied
        return Response(ItemDetailSerializer(self.get_item()).data)

    def patch(self, request, company_id, item_id):
        if denied := self.require_perm('items.edit'):
            return denied

        item = self.get_item()
        name = request.data.get('name', '').strip()

        if name and name != item.name:
            if Item.objects.filter(company=self.get_company(), name=name).exists():
                return Response(
                    {'detail': f'Item "{name}" already exists in this company.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.name = name

        if 'description' in request.data:
            item.description = request.data['description']
        if 'unit_of_measurement' in request.data:
            item.unit_of_measurement_id = request.data['unit_of_measurement']
        if 'is_active' in request.data:
            item.is_active = request.data['is_active']

        # Validate category belongs to this company before assigning
        if 'category' in request.data:
            category_id = request.data['category']
            if category_id and not Category.objects.filter(id=category_id, company=self.get_company()).exists():
                return Response(
                    {'detail': 'Category not found in this company.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.category_id = category_id

        item.save()
        return Response(ItemDetailSerializer(item).data)

    def delete(self, request, company_id, item_id):
        if denied := self.require_perm('items.delete'):
            return denied
        self.get_item().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# RECIPES
# ============================================================================

class RecipeListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/items/companies/{company_id}/items/{item_id}/recipes/   → items.view
    POST /api/items/companies/{company_id}/items/{item_id}/recipes/   → items.create

    POST body:
    {
        "name": "Standard Recipe",
        "output_quantity": 1.0,
        "is_default": true,
        "lines": [
            {"ingredient": <item_id>, "quantity": 0.5},
            {"ingredient": <item_id>, "quantity": 0.5}
        ]
    }
    """
    permission_classes = [IsAuthenticated]

    def get_item(self):
        # Only BOM items can have recipes
        return get_object_or_404(
            Item,
            id=self.kwargs['item_id'],
            company=self.get_company(),
            item_type='bom',
        )

    def get(self, request, company_id, item_id):
        if denied := self.require_perm('items.view'):
            return denied
        recipes = (
            Recipe.objects
            .filter(output_item=self.get_item())
            .prefetch_related('lines__ingredient__unit_of_measurement')
        )
        return Response(RecipeDetailSerializer(recipes, many=True).data)

    @transaction.atomic
    def post(self, request, company_id, item_id):
        if denied := self.require_perm('items.create'):
            return denied

        item            = self.get_item()
        name            = request.data.get('name', '').strip()
        output_quantity = request.data.get('output_quantity')
        lines_data      = request.data.get('lines', [])

        if not output_quantity:
            return Response({'detail': 'output_quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)

        is_default = request.data.get('is_default', False)

        # Unset previous default before setting the new one
        if is_default:
            Recipe.objects.filter(output_item=item, is_default=True).update(is_default=False)

        recipe = Recipe.objects.create(
            output_item=item,
            name=name or 'Recipe',
            output_quantity=output_quantity,
            is_default=is_default,
        )

        # Validate all ingredients belong to this company before bulk create
        ingredient_ids = [l['ingredient'] for l in lines_data]
        valid_ids = set(
            Item.objects.filter(id__in=ingredient_ids, company=self.get_company())
                        .values_list('id', flat=True)
        )
        invalid = set(ingredient_ids) - valid_ids
        if invalid:
            return Response(
                {'detail': f'Ingredients not found in this company: {list(invalid)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        RecipeLine.objects.bulk_create([
            RecipeLine(recipe=recipe, ingredient_id=l['ingredient'], quantity=l['quantity'])
            for l in lines_data
        ])

        return Response(RecipeDetailSerializer(recipe).data, status=status.HTTP_201_CREATED)


class RecipeDetailView(CompanyMemberMixin, APIView):
    """
    GET    /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/   → items.view
    PATCH  /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/   → items.edit
    DELETE /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/   → items.delete

    PATCH replaces lines entirely if "lines" key is present.
    Omit "lines" to update header fields only (name, output_quantity, is_default).
    """
    permission_classes = [IsAuthenticated]

    def get_recipe(self):
        return get_object_or_404(
            Recipe.objects.prefetch_related('lines__ingredient__unit_of_measurement'),
            id=self.kwargs['recipe_id'],
            output_item__id=self.kwargs['item_id'],
            output_item__company=self.get_company(),
        )

    def get(self, request, company_id, item_id, recipe_id):
        if denied := self.require_perm('items.view'):
            return denied
        return Response(RecipeDetailSerializer(self.get_recipe()).data)

    @transaction.atomic
    def patch(self, request, company_id, item_id, recipe_id):
        if denied := self.require_perm('items.edit'):
            return denied

        recipe = self.get_recipe()

        if 'name' in request.data:
            recipe.name = request.data['name'].strip()
        if 'output_quantity' in request.data:
            recipe.output_quantity = request.data['output_quantity']
        if 'is_default' in request.data:
            if request.data['is_default']:
                Recipe.objects.filter(
                    output_item=recipe.output_item, is_default=True
                ).exclude(pk=recipe.pk).update(is_default=False)
            recipe.is_default = request.data['is_default']

        recipe.save()

        # Replace all lines only if explicitly provided in the body
        if 'lines' in request.data:
            lines_data = request.data['lines']
            if not lines_data:
                return Response(
                    {'detail': 'lines cannot be empty. Provide at least one ingredient.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            ingredient_ids = [l['ingredient'] for l in lines_data]
            valid_ids = set(
                Item.objects.filter(id__in=ingredient_ids, company=self.get_company())
                            .values_list('id', flat=True)
            )
            invalid = set(ingredient_ids) - valid_ids
            if invalid:
                return Response(
                    {'detail': f'Ingredients not found in this company: {list(invalid)}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            recipe.lines.all().delete()
            RecipeLine.objects.bulk_create([
                RecipeLine(recipe=recipe, ingredient_id=l['ingredient'], quantity=l['quantity'])
                for l in lines_data
            ])

        return Response(RecipeDetailSerializer(recipe).data)

    def delete(self, request, company_id, item_id, recipe_id):
        if denied := self.require_perm('items.delete'):
            return denied
        self.get_recipe().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# RECIPE LINES  (granular ingredient management)
# ============================================================================

class RecipeLineListCreateView(CompanyMemberMixin, APIView):
    """
    GET  /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/lines/   → items.view
    POST /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/lines/   → items.edit

    POST body: { "ingredient": <item_id>, "quantity": 0.5 }

    Adds a single ingredient to an existing recipe.
    The ingredient must belong to the same company as the recipe's output item.
    """
    permission_classes = [IsAuthenticated]

    def get_recipe(self):
        return get_object_or_404(
            Recipe,
            id=self.kwargs['recipe_id'],
            output_item__id=self.kwargs['item_id'],
            output_item__company=self.get_company(),
        )

    def get(self, request, company_id, item_id, recipe_id):
        if denied := self.require_perm('items.view'):
            return denied
        lines = (
            self.get_recipe().lines
            .select_related('ingredient__unit_of_measurement')
        )
        return Response(RecipeLineSerializer(lines, many=True).data)

    def post(self, request, company_id, item_id, recipe_id):
        if denied := self.require_perm('items.edit'):
            return denied

        ingredient_id = request.data.get('ingredient')
        quantity      = request.data.get('quantity')

        if not ingredient_id:
            return Response({'detail': 'ingredient is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if quantity is None:
            return Response({'detail': 'quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if float(quantity) <= 0:
            return Response({'detail': 'quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)

        recipe = self.get_recipe()

        # Ingredient must belong to the same company — prevents cross-tenant data leaks
        ingredient = get_object_or_404(Item, id=ingredient_id, company=self.get_company())

        # Prevent adding the same ingredient twice to the same recipe
        if RecipeLine.objects.filter(recipe=recipe, ingredient=ingredient).exists():
            return Response(
                {'detail': f'"{ingredient.name}" is already in this recipe. Edit its quantity instead.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        line = RecipeLine.objects.create(recipe=recipe, ingredient=ingredient, quantity=quantity)
        return Response(RecipeLineSerializer(line).data, status=status.HTTP_201_CREATED)


class RecipeLineDetailView(CompanyMemberMixin, APIView):
    """
    PATCH  /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/lines/{line_id}/  → items.edit
    DELETE /api/items/companies/{company_id}/items/{item_id}/recipes/{recipe_id}/lines/{line_id}/  → items.edit

    PATCH body: { "quantity": 1.5 }

    Ingredient is immutable after creation — to change it, delete and re-add.
    """
    permission_classes = [IsAuthenticated]

    def get_line(self):
        # Traverse the full chain to ensure the line belongs to this company
        return get_object_or_404(
            RecipeLine.objects.select_related('ingredient__unit_of_measurement'),
            id=self.kwargs['line_id'],
            recipe__id=self.kwargs['recipe_id'],
            recipe__output_item__id=self.kwargs['item_id'],
            recipe__output_item__company=self.get_company(),
        )

    def patch(self, request, company_id, item_id, recipe_id, line_id):
        if denied := self.require_perm('items.edit'):
            return denied

        line     = self.get_line()
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response({'detail': 'quantity is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if float(quantity) <= 0:
            return Response({'detail': 'quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)

        line.quantity = quantity
        line.save(update_fields=['quantity'])
        return Response(RecipeLineSerializer(line).data)

    def delete(self, request, company_id, item_id, recipe_id, line_id):
        if denied := self.require_perm('items.edit'):
            return denied

        line   = self.get_line()
        recipe = line.recipe

        # A recipe must always have at least one ingredient
        if recipe.lines.count() == 1:
            return Response(
                {'detail': 'Cannot remove the last ingredient. A recipe must have at least one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        line.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)