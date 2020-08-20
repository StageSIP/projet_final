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
    if request.method == 'POST':
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
    logout(request)
    return(acceuil(request))



def valider_inscription(request):
    username=request.POST['username']
    password=request.POST['password']
    email=request.POST['email']
    user = User.objects.create_user(username, email, password)
    user.save()
    return (acceuil(request))