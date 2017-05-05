# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-21 23:02
from __future__ import unicode_literals

from django.db import migrations


def remove_empty_title_and_provider(apps, schema_editor):
    Item = apps.get_model('l8pr', 'Item')
    for item in Item.objects.all():
        if not item.title or not item.provider_name:
            item.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0024_auto_20170413_1653'),
    ]

    operations = [
        migrations.RunPython(remove_empty_title_and_provider),
    ]