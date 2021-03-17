from django.urls import path 
from .views import home, login_user, logout_user, students, clear_token , register , renew_token ,  all

urlpatterns = [
    path('',home),
    path('login/',login_user),
    path('logout/',logout_user),
    path('students/',students),
    path('clear_token/',clear_token),
    path('register/',register),
    path('all/',all),
    path('renew_token/',renew_token)
]   