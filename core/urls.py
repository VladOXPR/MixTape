from django.urls import path
from django.contrib.auth import views as auth_views
from . import views


urlpatterns = [
    path('', views.browse, name=''),
    path('friends', views.friends, name='friends'),
    path('profile/<str:pk>', views.profile, name='profile'),
    path('chat/<str:pk>', views.chat, name='chat'),

    path('sent_msg/<str:pk>', views.sentMessage, name='sent_msg'),
    path('rec_msg/<str:pk>', views.receivedMessage, name='rec_msg'),

    path('create', views.create, name='create'),
    path('settings', views.settings, name='settings'),
    path('setup', views.setup, name='setup'),
    path('workspace/<str:pk>', views.workspace, name='workspace'),

    path('drop', views.drop, name='drop'),
    path('publish', views.publish, name='publish'),

    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    path('test', views.test, name='test'),
]
