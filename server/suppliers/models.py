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