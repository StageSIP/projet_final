from django.urls import path
from . import views

urlpatterns = [
    path('', views.accueil, name='accueil'),
    path('deconnexion', views.deconnexion, name='deconnexion'),
    
]