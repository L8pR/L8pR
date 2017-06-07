# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2017-05-29 13:57
from __future__ import unicode_literals

from django.db import migrations


def create_profile(apps, schema_editor):
    Profile = apps.get_model('l8pr', 'Profile')
    User = apps.get_model('auth', 'User')
    for user in User.objects.all():
        Profile.objects.get_or_create(user=user)


class Migration(migrations.Migration):

    dependencies = [
        ('l8pr', '0029_profile_follows'),
    ]

    operations = [
        migrations.RunPython(create_profile),
    ]