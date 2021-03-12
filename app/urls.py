from django.urls import path 
from .views import home, login_user, logout_user

urlpatterns = [
    path('',home),
    path('login/',login_user),
    path('logout/',logout_user),
]   