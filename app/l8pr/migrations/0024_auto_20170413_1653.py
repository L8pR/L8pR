# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-04-13 16:53
from __future__ import unicode_literals

from django.db import migrations


def link_items_to_users(apps, schema_editor):
    Show = apps.get_model('l8pr', 'Show')
    ItemsUsersRelationship = apps.get_model('l8pr', 'ItemsUsersRelationship')
    for s in Show.objects.all():
        for i in s.items.all():
            if s.user not in i.users.all():
                rel = ItemsUsersRelationship(item=i, user=s.user)
                rel.save()


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0023_auto_20170405_1342'),
    ]

    operations = [
        migrations.RunPython(link_items_to_users),
    ]
