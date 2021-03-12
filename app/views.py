from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate , login, logout
from .models import Student
from django.core import serializers
import json
# Create your views here.
def home(request):
    # print(request)
    return JsonResponse({'hi':'hi'})

def login_user(request):
    context={}
    if request.method == "POST":
        print(request.POST)
        user=authenticate(request,
                        username=request.POST['userName'],
                        password=request.POST['password'])
        
        if user:
            login(request , user )
            context.update({
                'logedIn':True,
                'username':user.username,
                'error':''
            })
        else:
            context.update({
                'logedIn':False,
                'username':'',
                'error':'Invalid username or password'
            })
    else:
        print(request.user.username)
        context.update({
            'isLogedIn':request.user.is_authenticated,
            'username':request.user.username
        })
    return JsonResponse(context)


def logout_user(request):
    context={}
    if request.method == "POST":
        logout(request)
        context.update({
            'message':True
        })
    else:
        context.update({
             'message':False
        })
    
    return JsonResponse(context)

def students(request):
    if request.GET['query'] == 'all':
        students=Student.objects.all()
        students=serializers.serialize('json',students)
        return JsonResponse({ 'data' : students })
    
