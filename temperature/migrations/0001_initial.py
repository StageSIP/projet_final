# Generated by Django 3.1 on 2020-08-17 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='smpn',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('model', models.TextField()),
                ('centre', models.TextField()),
                ('domain', models.TextField()),
                ('rundate', models.DateField()),
                ('surface', models.TextField()),
                ('level', models.DecimalField(decimal_places=5, max_digits=5)),
                ('_range', models.DecimalField(decimal_places=5, max_digits=5)),
                ('rangeunit', models.TextField()),
                ('recdate', models.DateField()),
                ('_url', models.TextField()),
            ],
        ),
    ]
