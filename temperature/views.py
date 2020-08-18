from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def acceuil(request):
    return render(request,'acceuil.html')

def carte(request):
    return render(request,'carte.html')

#def acceuil(request):
#    return render(request,'acceuil.html')

#def acceuil(request):
#    return render(request,'acceuil.html')
