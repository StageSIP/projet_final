from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import logout
# Create your views here.
def acceuil(request):
    if request.user.is_authenticated:
        return render(request, 'acceuil/index.html')
    else:
        return redirect("/")


        