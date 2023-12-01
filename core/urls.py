from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name=''),
    path('create', views.create, name='create'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin')
]
