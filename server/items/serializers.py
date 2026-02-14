from rest_framework import serializers
from .models import Category, Item, Recipe, RecipeLine


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class RecipeLineSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    ingredient_uom  = serializers.CharField(source='ingredient.unit_of_measurement.abbreviation', read_only=True)

    class Meta:
        model = RecipeLine
        fields = ['id', 'ingredient', 'ingredient_name', 'ingredient_uom', 'quantity']


class RecipeSerializer(serializers.ModelSerializer):
    """Lightweight — used in list views."""
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'output_quantity', 'is_default', 'created_at']


class RecipeDetailSerializer(serializers.ModelSerializer):
    """Full recipe with all lines expanded."""
    lines = RecipeLineSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'output_quantity', 'is_default', 'created_at', 'lines']


class ItemSerializer(serializers.ModelSerializer):
    """Lightweight — used in list views."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    uom            = serializers.CharField(source='unit_of_measurement.abbreviation', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'item_type', 'uom', 'category', 'category_name', 'is_active', 'date_added']


class ItemDetailSerializer(serializers.ModelSerializer):
    """Full item — includes recipes if it is a BOM item."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    uom            = serializers.CharField(source='unit_of_measurement.abbreviation', read_only=True)
    recipes        = RecipeSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'item_type', 'unit_of_measurement', 'uom',
                  'category', 'category_name', 'is_active', 'date_added', 'recipes']