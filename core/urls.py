from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse, name=''),
    path('create', views.create, name='create'),
    path('drop', views.drop, name='drop'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin')
]
