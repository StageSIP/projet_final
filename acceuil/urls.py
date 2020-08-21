from django.urls import path
from . import views

urlpatterns = [
    path('', views.acceuil, name='acceuil'),
    #path('deconnexion', views.deconnexion, name='deconnexion')
]