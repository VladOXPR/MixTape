from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse
from django.contrib import messages
from .models import Profile
from django.contrib.auth.decorators import login_required


@login_required(login_url='signin')
def home(request):
    user_object = User.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=request.user)

    profiles = Profile.objects.all()
    return render(request, 'home.html', {'user_profile': user_profile, 'profiles': profiles})


@login_required(login_url='signin')
def setting(request):
    user_profile = Profile.objects.get(user=request.user)
    if request.method == 'POST':

        if request.FILES.get('image') == None:
            image = user_profile.profileimg
            bio = request.POST['bio']
            name = request.POST['name']

            user_profile.profileimg = image
            user_profile.bio = bio
            user_profile.name = name
            user_profile.save()

        if request.FILES.get('image') != None:
            image = request.FILES.get('image')
            bio = request.POST['bio']
            name = request.POST['name']

            user_profile.profileimg = image
            user_profile.bio = bio
            user_profile.name = name
            user_profile.save()

        return redirect('setting')
    return render(request, 'setting.html', {'user_profile': user_profile})


@login_required(login_url='signin')
def profile(request, pk):
    user_object = User.objects.get(username=pk)
    user_profile = Profile.objects.get(user=user_object)
    context = {
        'user_object': user_object,
        'user_profile': user_profile,
    }

    return render(request, 'profile.html', context)


def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(email=email).exists():
            messages.info(request, 'Email Taken')
            return redirect('signup')
        elif User.objects.filter(username=username).exists():
            messages.info(request, 'Username Taken')
            return redirect('signup')
        else:
            user = User.objects.create_user(email=email, username=username, password=password)
            user.save()

            # Log user in and redirect to settings page
            user_login = auth.authenticate(username=username, password=password)
            auth.login(request, user_login)

            user_model = User.objects.get(username=username)
            new_profile = Profile.objects.create(user=user_model, id_user=user_model.id)
            new_profile.save()
            return redirect('')


    else:
        return render(request, 'signup.html')


def signin(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect('')
        else:
            messages.info(request, 'Credentials Invalid')
            return redirect('')
    else:
        return render(request, 'signin.html')
