from django.urls import path
from .views import home, get_students , login_user, logout_user, students, del_students, register, renew_token, add_student, login_user_from_cookie,  all

urlpatterns = [
    path('', home),
    path('login/', login_user),
    path('login_c/', login_user_from_cookie),
    path('logout/', logout_user),
    path('students/', students),
    path('add_student/', add_student),
    path('del_students/', del_students),
    path('get_students/', get_students),
    # path('clear_token/',clear_token),
    path('register/', register),
    path('all/', all),
    path('renew_token/', renew_token)
]
