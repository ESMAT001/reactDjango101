from django.urls import path , re_path
from .views import home

urlpatterns = [
    path('',home),
    # path(r'^/$',home),
    re_path('/.*', home),
]