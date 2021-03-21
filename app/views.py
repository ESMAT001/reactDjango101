from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate , login, logout
from .models import Student ,Token
from django.http import HttpResponse
from django.core import serializers
import json
from .auth import Auth
from django.contrib.auth.models import User



auth=Auth(Token)

# Create your views here.
def home(request):
    v=auth.create_token('ahmad1')
    print(v)
    return HttpResponse(v)

def login_user_from_cookie(request):
    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'login':False,
            'message':'login failed , invalid crediantials'
        })
    context={}
    data = json.loads(request.body)
    user_info= Token.objects.filter(username=data['username'])[0]

    user=authenticate(request,
                        username=user_info.username,
                        password=user_info.password)

    if user:
        login(request , user )
        print("password",user.password)
        user_token = auth.create_token(user.username,user_info.password)
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

    return JsonResponse(context)


def login_user(request):

    context={}
   
    if request.method == "POST":
        # print(request.POST)
        data = json.loads(request.body)
        print(data)
        user=authenticate(username=data['username'],password=data['password'])

        print('user --- ',user)
        if user:
            
            login(request , user )
            print("password",user.password)
            user_token = auth.create_token(user.username,data['password'])
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
        context.update({
             'error':'request method must be post'
        })
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

def register(request):
    
    data=json.loads(request.body)
    username=data.get('username')
    firstname=data.get('firstname')
    email=data.get('email')
    password=data.get('password')
    try:
        user=User.objects.create_user(
            username=username,
            first_name=firstname,
            email=email,
            password=password,
        )
        print(user.password ,'----password')
        # user.set_password(password)
        # user.save()
        return JsonResponse({
            'register':True,
            'error':''
        })
    except Exception as e:
        return JsonResponse({
            'register':False,
            'error':f'{e}'
        })


def all(r):
    tokens=Token.objects.all()
    tokens=serializers.serialize("json",tokens)
    return JsonResponse({'data':tokens})

def renew_token(request):

    new_token=auth.renew_token(request)
    print(new_token)

    if not new_token:
        return JsonResponse({
            'error':'invalid cridentials'
        })
    
    data=json.loads(request.body)
    username=data.get('username')

    return JsonResponse({
        'username':username,
        'token':new_token,
        'error':'invalid cridentials'
    })


