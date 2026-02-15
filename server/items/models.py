from django.db import models
from companies.models import Company

class UnitOfMeasure(models.Model):
    """
    Reusable units: kg, L, pcs, g, ml, etc.
    Keeping it as a separate model lets add conversion factors later.
    """
    name = models.CharField(max_length=50, unique=True)
    abbreviation = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.abbreviation
    
    class Meta:
        db_table = 'unitofmeasure'
        verbose_name = 'Unit of Measure'
        verbose_name_plural = 'Units of Measure'


class Category(models.Model):
    """
    Category for items
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'category'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        constraints = [
            # Two companies can both have a category called "Packaging" — that's fine
            # But one company can't have two "Packaging" categories
            models.UniqueConstraint(fields=['company', 'name'], name='uniq_category_name_per_company')
        ]


class Item(models.Model):
    """
    Item used as template for LOTs.
    """

    ITEM_TYPES = [
        ("raw", "Raw Material"),
        ('bom', "Manufactured / BOM Item"),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    unit_of_measurement = models.ForeignKey(UnitOfMeasure, on_delete=models.PROTECT, related_name='items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPES, default='raw')
    is_active = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'items'
        verbose_name = 'Item'
        verbose_name_plural = 'Items'
        ordering = ['-date_added']
        constraints = [
            # Same item name can exist in different companies, not within the same one
            models.UniqueConstraint(fields=['company', 'name'], name='uniq_item_name_per_company')
        ]
    
    def __str__(self):
        return self.name


class Recipe(models.Model):
    """
    BOM recipe main information
    """
    output_item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='recipes', limit_choices_to={"item_type": "bom"})
    output_quantity = models.FloatField(help_text="How much this recipe produces")
    name = models.CharField(max_length=100, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.output_item.name} - {self.name or 'Recipe'}"
    
    class Meta:
        db_table = 'recipes'
        verbose_name = 'Recipe'
        verbose_name_plural = 'Recipes'
        ordering = ['-created_at']


class RecipeLine(models.Model):
    """
    One ingredient row. Add/remove as many as you need.
    """
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="lines")
    ingredient = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='used_in_recipes')
    quantity = models.FloatField(help_text="Quantity needed per recipe run")

    def __str__(self):
        return f"{self.ingredient.name} x {self.quantity}"
    
    class Meta:
        db_table = 'recipeline'
        verbose_name = 'Recipe Line'
        verbose_name_plural = 'Recipe Lines'


class ItemAttribute(models.Model):
    """
    Dynamic key-value attributes attached to an Item.

    Allows each item to carry arbitrary metadata without schema changes —
    e.g. "Color: Red", "Shelf Life: 12 months", "Storage Temp: -18°C".
    Value is always stored as a string — interpretation is up to the consumer.
    """
    item  = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='attributes')
    key   = models.CharField(max_length=100)
    value = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.item.name} — {self.key}: {self.value}"

    class Meta:
        db_table = 'item_attributes'
        verbose_name = 'Item Attribute'
        verbose_name_plural = 'Item Attributes'
        ordering = ['key']
        constraints = [
            # One item can't have two attributes with the same key
            # e.g. you can't have "Color: Red" and "Color: Blue" on the same item —
            # update the value instead
            models.UniqueConstraint(fields=['item', 'key'], name='uniq_attribute_key_per_item')
        ]