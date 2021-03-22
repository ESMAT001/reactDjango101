from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .models import Student, Token
from django.http import HttpResponse
from django.core import serializers
import json
from .auth import Auth
from django.contrib.auth.models import User
from django.core.paginator import Paginator


auth = Auth(Token)

# Create your views here.


def home(request):
    v = auth.create_token('ahmad1')
    print(v)
    return HttpResponse(v)


def login_user_from_cookie(request):
    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'login': False,
            'message': 'login failed , invalid crediantials'
        })
    context = {}
    user_info = Token.objects.filter(username=request.headers['username'])[0]

    user = authenticate(request,
                        username=user_info.username,
                        password=user_info.password)

    if user:
        login(request, user)
        print("password", user.password)
        user_token = auth.create_token(user.username, user_info.password)
        context.update({
            'logedIn': True,
            'username': user.username,
            'token': user_token,
            'error': ''
        })
    else:
        context.update({
            'logedIn': False,
            'username': '',
            'error': 'Invalid username or password'
        })

    return JsonResponse(context)


def login_user(request):

    context = {}

    if request.method == "POST":
        # print(request.POST)
        data = json.loads(request.body)
        print(data)
        user = authenticate(
            username=data['username'], password=data['password'])

        print('user --- ', user)
        if user:

            login(request, user)
            print("password", user.password)
            user_token = auth.create_token(user.username, data['password'])
            context.update({
                'logedIn': True,
                'username': user.username,
                'token': user_token,
                'error': ''
            })
        else:
            context.update({
                'logedIn': False,
                'username': '',
                'error': 'Invalid username or password'
            })
    else:
        context.update({
            'error': 'request method must be post'
        })
    return JsonResponse(context)


def logout_user(request):

    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'logout': False,
            'message': 'logout failed , invalid crediantials'
        })

    logout(checked_request)
    username = request.headers['username']
    auth.delete_user_token(username)

    # print(username,' token deleted')
    # print(auth.get_all())
    return JsonResponse({
        'logout': True,
        'message': 'logout successful'
    })


# def clear_token(request):

#     checked_request = auth.auth_token(request)
#     if not checked_request:
#         return JsonResponse({
#             'fetch': False,
#             'message': 'fetch failed , invalid crediantials'
#         })
#     username = json.loads(checked_request.body)['username']
#     auth.delete_user_token(username)
#     print('token deleted')
#     return JsonResponse({
#         'deleted': True,
#         'message': 'deleted successful'
#     })


def register(request):

    data = json.loads(request.body)
    username = data.get('username')
    firstname = data.get('firstname')
    email = data.get('email')
    password = data.get('password')
    try:
        user = User.objects.create_user(
            username=username,
            first_name=firstname,
            email=email,
            password=password,
        )
        print(user.password, '----password')
        # user.set_password(password)
        # user.save()
        return JsonResponse({
            'register': True,
            'error': ''
        })
    except Exception as e:
        return JsonResponse({
            'register': False,
            'error': f'{e}'
        })


def all(r):
    tokens = Token.objects.all()
    tokens = serializers.serialize("json", tokens)
    return JsonResponse({'data': tokens})


def renew_token(request):

    new_token = auth.renew_token(request)
    print(new_token)

    if not new_token:
        return JsonResponse({
            'error': 'invalid cridentials'
        })

    username = request.headers['username']

    return JsonResponse({
        'username': username,
        'token': new_token,
        'error': 'invalid cridentials'
    })


def students(request):
    
    if not auth.auth_token(request):
        return JsonResponse({
            'fetch': False,
            'message': 'fetch failed , invalid crediantials'
        })

    data = json.loads(request.body)
    search_text = data.get('q')
    page = data.get('page') if data.get('page') else '1'
    if search_text:
        students = Student.objects.filter(name__icontains=search_text)
    else:
        students = Student.objects.all()

    if students:
        pagenation = Paginator(students, 4)
        students = pagenation.get_page(page)
        pagenation_info = {
            "has_previous": students.has_previous(),
            'has_next': students.has_next(),
            'start_index': students.start_index(),
            'num_pages': students.paginator.num_pages,
            'number': students.number
        }
        if pagenation_info['has_previous']:
            pagenation_info.update({
                'previous_page': students.previous_page_number(),
                'previous_page_number': students.previous_page_number()
            })

        if pagenation_info['has_next']:
            pagenation_info.update({
                'next_page': students.next_page_number(),
                'next_page_number': students.next_page_number()
            })

    students = serializers.serialize('json', students)
    return JsonResponse({
        'fetch': True,
        'data': students,
        'pagenation': pagenation_info if pagenation_info else {}
    })


def add_student(request):
    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'created': False,
            'error': 'student data creation failed , invalid crediantials'
        })

    name = request.POST.get('name')
    fname = request.POST.get('fname')
    lastname = request.POST.get('lastname')
    date = request.POST.get('date')
    email = request.POST.get('email')
    image = request.FILES.get('image')
    # print(request.FILES)
    student_info = Student.objects.filter(email=email)
    if student_info.exists():
        student_info = student_info[0]
        student_info.name = name
        student_info.fname = fname
        student_info.last_name = lastname
        student_info.date_of_birth = date
        student_info.email = email
        if image:
            student_info.image = image
        student_info.save()
    else:
        student = Student.objects.create(
            name=name,
            fname=fname,
            last_name=lastname,
            date_of_birth=date,
            email=email
        )
        student.image = image
        student.save()

    # print(request.POST)
    # print(request.FILES)
    return JsonResponse({
        'created': True,
        'error': ''
    })


def del_students(request):
    checked_request = auth.auth_token(request)

    if not checked_request:
        return JsonResponse({
            'deleted': False,
            'error': 'student deletion failed , invalid crediantials'
        })
    del checked_request
    pk = json.loads(request.body).get('id')
    student = Student.objects.filter(pk=pk)
    if student.exists():
        student[0].delete()
        return JsonResponse({
            'deleted': True,
            'error': ''
        })


def get_students(request):
    error = {
        'student_found': False,
        'student': '',
        'error': 'student not found'
    }
    if not auth.auth_token(request):
        return JsonResponse(error)
    pk = json.loads(request.body).get('id')
    student = Student.objects.filter(pk=pk)
    if not student.exists():
        return JsonResponse(error)

    student = serializers.serialize("json", student)
    return JsonResponse({
        'student_found': True,
        'student': student,
        'error': ''
    })
