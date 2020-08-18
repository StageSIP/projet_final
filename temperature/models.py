from django.db import models

# Create your models here.

class smpn(models.Model):
    model =models.TextField()
    centre =models.TextField()
    domain =models.TextField()
    rundate =models.DateField()
    surface =models.TextField()
    level =models.DecimalField(max_digits=5, decimal_places=5)
    _range=models.DecimalField(max_digits=5, decimal_places=5)
    rangeunit=models.TextField()
    recdate=models.DateField()
    _url=models.TextField()


