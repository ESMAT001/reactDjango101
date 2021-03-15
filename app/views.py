from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate , login, logout
from .models import Student
from django.http import HttpResponse
from django.core import serializers
import json
from .auth import Auth

auth=Auth()

# Create your views here.
def home(request):
    print(request)
    # print("Home function accessed")
    # response = json.dumps()
    return JsonResponse({'name': 'hello'})

def login_user(request):
   

    context={}
   
    if request.method == "POST":
        # print(request.POST)
        data = json.loads(request.body)
        print(data)
        user=authenticate(request,
                        username=data['username'],
                        password=data['password'])
        
        if user:
            login(request , user )
            user_token = auth.add_user_token(user.username)
            context.update({
                'logedIn':True,
                'username':user.username,
                'token': user_token,
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
    
    print(auth.get_all())
    return JsonResponse(context)


def logout_user(request):
    
    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'logout':False,
            'message':'logout failed , invalid crediantials'
        })


    logout(checked_request)
    username=json.loads(request.body)['username']
    auth.delete_user_token(username)

    # print(username,' token deleted')
    # print(auth.get_all())
    return JsonResponse({
        'logout':True,
        'message':'logout successful'
    })

def students(request):

    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'fetch':False,
            'message':'fetch failed , invalid crediantials'
        })

    students=Student.objects.all()
    students=serializers.serialize('json',students)
    return JsonResponse({ 
        'fetch':True,
        'data' : students 
        })
    

def clear_token(request):

    checked_request = auth.auth_token(request)
    if not checked_request:
        return JsonResponse({
            'fetch':False,
            'message':'fetch failed , invalid crediantials'
        })
    username=json.loads(checked_request.body)['username']
    auth.delete_user_token(username)
    print('token deleted')
    return JsonResponse({
        'deleted':True,
        'message':'deleted successful'
    })




def all(r):
    return JsonResponse(auth.get_all())