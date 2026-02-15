from django.db import migrations
from items.constants import UNITS_OF_MEASUREMENT


def seed_units(apps, schema_editor):
    UnitOfMeasure = apps.get_model("items", "UnitOfMeasure")
    for uom in UNITS_OF_MEASUREMENT:
        UnitOfMeasure.objects.get_or_create(
            abbreviation=uom["abbreviation"],
            defaults={"name": uom["name"]},
        )


def unseed_units(apps, schema_editor):
    UnitOfMeasure = apps.get_model("items", "UnitOfMeasure")
    abbreviations = [u["abbreviation"] for u in UNITS_OF_MEASUREMENT]
    UnitOfMeasure.objects.filter(abbreviation__in=abbreviations).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("items", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_units, reverse_code=unseed_units),
    ]