from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from .models import Profile, Project, Friend, Message
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.utils.text import slugify
from core.forms import ChatMessageForm
from django.contrib import messages
from django.db.models import Q


@login_required(login_url='signin')
def browse(request):
    user_object = User.objects.get(username=request.user.username)
    user_profile = Profile.objects.get(user=request.user)

    profiles = Profile.objects.all()
    return render(request, 'browse.html', {'user_profile': user_profile, 'profiles': profiles})


def test(request):
    profiles = Profile.objects.all()
    user_profile = Profile.objects.get(user=2)
    user_projects = user_profile.projects1.all()
    all_projects = Project.objects.all()
    x = Project.objects.get(id=30)
    some_project = x.users.all()

    return render(request, 'test.html',
                  {'profiles': profiles, 'user_profile': user_profile, 'user_projects': user_projects,
                   'all_projects': all_projects, 'some_projects': some_project})


@login_required(login_url='signin')
def create(request):
    user_profile = Profile.objects.get(user=request.user)
    user_name = user_profile.name
    user_projects = user_profile.projects.all()

    return render(request, 'create.html', {'user_profile': user_profile, 'user_projects': user_projects})


@login_required(login_url='signin')
def drop(request):
    # user_profile = Profile.objects.get(user=request.user)
    # published = user_profile.published.all()

    return render(request, 'drop.html', {})


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
def chat(request, pk):
    friend_object = User.objects.get(username=pk)
    friend_profile = Profile.objects.get(user=friend_object)
    user_object = Profile.objects.get(user=request.user)
    chats = Message.objects.filter(
        Q(sender=user_object, recipient=friend_profile) | Q(sender=friend_profile, recipient=user_object))
    form = ChatMessageForm()

    if request.method == 'POST':
        form = ChatMessageForm(request.POST)
        if form.is_valid():
            chat_message = form.save(commit=False)
            chat_message.sender = user_object
            chat_message.recipient = friend_profile
            chat_message.save()

            return redirect('chat', pk=friend_object.username)

    context = {
        'friend_object': friend_object,
        'friend_profile': friend_profile,
        'user_object': user_object,
        'chats': chats,
        'form': form
    }
    return render(request, 'chat.html', context)


@login_required(login_url='signin')
def friends(request):
    user_object = Profile.objects.get(user=request.user)
    user_friends = Friend.objects.filter(profile=user_object)

    return render(request, 'friends.html', {'user_friends': user_friends})


@login_required(login_url='signin')
def profile(request, pk):
    user_object = User.objects.get(username=pk)
    user_profile = Profile.objects.get(user=user_object)
    user_projects = user_profile.projects.all()

    context = {
        'user_object': user_object,
        'user_profile': user_profile,
    }

    return render(request, 'profile.html',
                  {'user_profile': user_profile, 'user_object': user_object, 'projects': user_projects})


@login_required(login_url='signin')
def workspace(request, pk):
    # user_object = User.objects.get(username=request.user)
    user_project = Project.objects.get(id=pk)

    if request.method == 'POST':

        if request.FILES.get('image') == None:
            image = user_project.coverimg
            title = request.POST['title']

            user_project.coverimg = image
            user_project.title = title
            user_project.save()

        if request.FILES.get('image') != None:
            image = request.FILES['image']
            title = request.POST['title']

            user_project.coverimg = image
            user_project.title = title
            user_project.save()

        return redirect('create')

    return render(request, 'workspace.html', {'user_project': user_project})


@login_required(login_url='signin')
def setup(request):
    if request.method == 'POST':
        user_profile = Profile.objects.get(user=request.user)
        title = request.POST['title']

        new_project = Project.objects.create(title=title)
        new_project.save()

        user_profile.projects.add(new_project)

        return redirect(f'/workspace/{slugify(new_project.id)}')

    return render(request, 'setup.html')


def signup(request):
    if request.method == 'POST':
        email = request.POST['email']
        username = request.POST['username']
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


def sentMessage(request, pk):
    data = json.loads(request.body)
    new_chat = data['message']
    return JsonResponse("is it working?", safe=False)
