from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.browse, name=''),
    path('setup', views.setup, name='setup'),
    path('create', views.create, name='create'),
    path('drop', views.drop, name='drop'),
    path('settings', views.settings, name='settings'),
    path('publish', views.publish, name='publish'),
    path('setup', views.setup, name='setup'),
    path('friends', views.friends, name='friends'),
    path('workspace/<str:pk>', views.workspace, name='workspace'),
    path('profile/<str:pk>', views.profile, name='profile'),  # pk - primary key, represents what you want the url to be
    path('chat/<str:pk>', views.chat, name='chat'),
    path('sent_msg/<str:pk>', views.sentMessage, name='sent_msg'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('test', views.test, name='test'),

]
