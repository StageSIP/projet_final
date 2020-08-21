from django.urls import path
from . import views

urlpatterns = [
    path('', views.acceuil, name='login'),
    path('acceuil/', views.acceuil),
    #path('carte/', temperature.views.carte),
    path('connexion/', views.connexion),
    path('verify_connect/',views.valider_inscription),
    path('inscription/',views.inscription),
    path('deconnexion/',views.deconnexion),
    path('compte/',views.compte),
]