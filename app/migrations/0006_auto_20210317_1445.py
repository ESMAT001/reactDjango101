# Generated by Django 3.1.6 on 2021-03-17 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20210317_1440'),
    ]

    operations = [
        migrations.AlterField(
            model_name='token',
            name='expire_date',
            field=models.DateTimeField(),
        ),
    ]