# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-05-03 08:03
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0025_auto_20170421_2302'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='itemsusersrelationship',
            name='item',
        ),
        migrations.RemoveField(
            model_name='itemsusersrelationship',
            name='user',
        ),
        migrations.RemoveField(
            model_name='item',
            name='users',
        ),
        migrations.DeleteModel(
            name='ItemsUsersRelationship',
        ),
    ]