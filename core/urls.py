from django.urls import path
from . import views

urlpatterns = [
    path('', views.browse, name=''),
    path('create', views.create, name='create'),
    path('drop', views.drop, name='drop'),
    path('settings', views.settings, name='settings'),
    path('publish', views.publish, name='publish'),
    path('message/<str:pk>', views.message, name='message'),
    path('workspace/<str:pk>', views.workspace, name='workspace'),
    path('profile/<str:pk>', views.profile, name='profile'), # ? what is the /<str:pk>
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin')
]
