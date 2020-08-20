from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth import logout
# Create your views here.

def acceuil(request):
    #si utilisateur connecté, retourner carte
    if request.user.is_authenticated:
        return render(request,'carte.html')
    #sinon, retourner page de connexion
    else:
        return render(request,'acceuil.html')

def carte(request):
    #return render(request,'carte.html')
    pass

def connexion(request):
    if request.method == 'POST' and not request.user.is_authenticated:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return render(request,'carte.html')

        else:
            reponse= """
            Vous n'êtes pas enregistré; Veuillez vous enregistrer d'abord!!!
            """
            return HttpResponse(reponse)
    else:
        return(acceuil(request))

def inscription(request):
    return render(request,'inscription.html')

def deconnexion(request):
    try:
        if request.user.is_authenticated:
            logout(request)
            return(acceuil(request))
        else:
            return(acceuil(request))
    except NameError:
        return(acceuil(request))


def valider_inscription(request):
    username=request.POST['username']
    password=request.POST['password']
    email=request.POST['email']
    user = User.objects.create_user(username, email, password)
    user.first_name=request.POST['first_name']
    user.last_name=request.POST['last_name']
    user.save()
    return (acceuil(request))

def compte(request):
    return render(request,'compte.html')