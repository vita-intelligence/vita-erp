from django.db import models
from companies.models import Company


class Supplier(models.Model):
    company  = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='suppliers')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'suppliers'
        verbose_name = 'Supplier'
        verbose_name_plural = 'Suppliers'
        ordering = ['-date_added']
        constraints = [
            models.UniqueConstraint(fields=['company', 'name'], name='uniq_supplier_name_per_company')
        ]


class SupplierAddress(models.Model):

    ADDRESS_TYPES = [
        ('headquarters', 'Headquarters'),
        ('warehouse',    'Warehouse'),
        ('billing',      'Billing'),
        ('other',        'Other'),
    ]

    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=100, blank=True)  # e.g. "Main Warehouse"
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default='headquarters')

    # Location
    street = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20,  blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Coordinates — populated manually or via geocoding later
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.supplier.name} — {self.get_address_type_display()}"

    class Meta:
        db_table = 'supplier_addresses'
        verbose_name = 'Supplier Address'
        verbose_name_plural = 'Supplier Addresses'
        ordering = ['-is_primary', 'address_type']