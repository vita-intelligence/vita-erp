from django.db import models
from django.core.validators import RegexValidator


class Company(models.Model):
    """
    Company model representing an organization registered in the system.

    This model stores the core identifying information for a company,
    including its legal name, optional description, and creation timestamp.
    Company records are intended to be unique and serve as the primary
    organizational entity for business operations within the application.

    Fields:
        name (CharField):
            The company’s full legal name. Must be unique.

        description (TextField):
            Optional free-text description providing additional
            context about the company.

        date_created (DateTimeField):
            Timestamp indicating when the company record
            was created in the system.
    """
    name = models.CharField(
        max_length=255,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[\w\s&.,'()+\-\/]+$",
                message="Company name contains invalid characters.",
                code="invalid_company_name",
            )
        ],
        error_messages={
            'unique': 'A company with that name already exists.',
        },
        help_text="Required. Enter the company’s full legal name. Must be unique.",
    )

    description = models.TextField(blank=True, default="")
    date_created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'companies'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        ordering = ['-date_created']
    
    def __str__(self):
        return self.name