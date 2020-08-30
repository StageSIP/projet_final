from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.conf import settings
from django.http import JsonResponse
import os
import json

# Create your views here.
def accueil(request):
    if request.user.is_authenticated:
        return render(request, 'accueil/index.html')
    else:
        return redirect("/connexion")

def deconnexion(request):
        if request.user.is_authenticated:
            logout(request)
            return redirect('/connexion')
        else:
            return redirect('/connexion')
def temp(request):
    if request.user.is_authenticated and request.is_ajax and request.method == "GET":
        json_data = open(os.path.join( settings.BASE_DIR, 'accueil/static/accueil/TMIN.2M.96H.json' )) 
        data1 = json.load(json_data)
        return JsonResponse({'json':data1})
