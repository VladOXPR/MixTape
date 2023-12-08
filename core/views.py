from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse
from django.contrib import messages
from .models import Profile, Project, Published
from django.contrib.auth.decorators import login_required


@login_required(login_url='signin')
def browse(request):
    user_object = User.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=request.user)

    profiles = Profile.objects.all()
    return render(request, 'browse.html', {'user_profile': user_profile, 'profiles': profiles})


@login_required(login_url='signin')
def create(request):
    user_profile = Profile.objects.get(user=request.user)
    projects = user_profile.projects.all()

    return render(request, 'create.html', {'user_profile': user_profile, 'projects': projects})

@login_required(login_url='signin')
def drop(request):
    user_profile = Profile.objects.get(user=request.user)
    published = user_profile.published.all()

    return render(request, 'drop.html', {'user_profile': user_profile, 'published': published})


@login_required(login_url='signin')
def settings(request):
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

        return redirect('create')

    return render(request, 'settings.html', {'user_profile': user_profile})


@login_required(login_url='signin')
def publish(request):
    user_profile = Profile.objects.get(user=request.user)

    return render(request, 'publish.html', {'user_profile': user_profile})

@login_required(login_url='signin')
def message(request, pk):
    user_object = User.objects.get(username=pk)
    user_profile = Profile.objects.get(user=request.user)

    context = {
        'user_object': user_object,
        'user_profile': user_profile,
    }

    return render(request, 'message.html', {'user_profile': user_profile})

@login_required(login_url='signin')
def profile(request, pk):
    user_object = User.objects.get(username=pk)
    user_profile = Profile.objects.get(user=user_object)
    projects = user_profile.projects.all()

    context = {
        'user_object': user_object,
        'user_profile': user_profile,
    }

    return render(request, 'profile.html', {'user_profile': user_profile, 'user_object': user_object, 'projects': projects})


@login_required(login_url='signin')
def workspace(request, pk):
    user_project = Project.objects.get(title=pk)

    if request.method == 'POST':

        if request.FILES.get('image') == None:
            image = user_project.coverimg
            title = request.POST['title']

            user_profile.coverimg = image
            user_profile.title = title
            user_profile.save()

        if request.FILES.get('image') != None:
            image = user_project.coverimg
            title = request.POST['title']

            user_profile.coverimg = image
            user_profile.title = title
            user_profile.save()

        return redirect('create')

    return render(request, 'workspace.html', {'user_project': user_project})


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

            # Log user in and redirect to creates page
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
