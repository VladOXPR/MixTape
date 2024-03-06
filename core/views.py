from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from .models import Profile, Project, Message, Track
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.utils.text import slugify
from core.forms import ChatMessageForm, SettingsForm, ProjectForm, TrackForm
from django.contrib import messages
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt


@login_required(login_url='signin')
def browse(request):
    user_profile = Profile.objects.get(user=request.user)

    profiles = Profile.objects.all()
    return render(request, 'browse.html', {'user_profile': user_profile, 'profiles': profiles})


@login_required(login_url='signin')
def create(request):
    user_profile = Profile.objects.get(user=request.user)
    user_projects = user_profile.project_set.all()

    last_text = Message.objects.filter(receiver=user_profile).last()

    if last_text:
        last_text_user = Profile.objects.get(user=last_text.sender.user)
    else:
        last_text_user = None

    unread = Message.objects.filter(seen=False, receiver=user_profile).count()

    context = {
        'user_profile': user_profile,
        'user_projects': user_projects,
        'last_text': last_text,
        'last_text_user': last_text_user,
        'unread': unread
    }
    return render(request, 'create.html', context)


@login_required(login_url='signin')
def drop(request):
    # user_profile = Profile.objects.get(user=request.user)
    # published = user_profile.published.all()

    return render(request, 'drop.html', {})


@login_required(login_url='signin')
def settings(request):
    user_profile = Profile.objects.get(user=request.user)
    form = SettingsForm(request.POST or None, request.FILES or None, instance=user_profile)

    if form.is_valid():
        print('--- VALID FORM ---')
        form.save()
        return JsonResponse({'message': 'works'})
    elif not form.is_valid():
        print('--- not valid ---')
        print(form.errors)

    return render(request, 'settings.html', {'form': form, 'user_profile': user_profile})


@login_required(login_url='signin')
def publish(request):
    user_profile = Profile.objects.get(user=request.user)

    return render(request, 'publish.html', {'user_profile': user_profile})


@login_required(login_url='signin')
def friends(request):
    user_profile = Profile.objects.get(user=request.user)
    friendships = user_profile.friends.all()

    chats = []

    for friend in friendships:
        latest_message = Message.objects.filter(
            (Q(sender=user_profile, receiver=friend) | Q(sender=friend, receiver=user_profile)) & ~Q(
                sender=user_profile, receiver=user_profile)
        ).order_by('-timestamp').first()  # Using 'order_by' to ensure the latest message is retrieved

        if latest_message:
            # Determine if the friend is the sender or receiver, then add them to the chat info
            if latest_message.sender == user_profile:
                chat_info = {'friend': latest_message.receiver, 'message': latest_message}
            else:
                chat_info = {'friend': latest_message.sender, 'message': latest_message}

            chats.append(chat_info)

    return render(request, 'friends.html', {'chats': chats})


@login_required(login_url='signin')
def chat(request, pk):
    friend_user_object = User.objects.get(username=pk)
    friend_profile = Profile.objects.get(user=friend_user_object)

    user_profile = Profile.objects.get(user=request.user)

    is_friend = user_profile.friends.filter(user=friend_user_object).exists()

    if not is_friend:
        user_profile.friends.add(friend_profile)

    texts = Message.objects.filter(
        Q(sender=friend_profile, receiver=user_profile) | Q(sender=user_profile, receiver=friend_profile)).order_by(
        '-timestamp').reverse()

    form = ChatMessageForm()

    for text in texts:
        if text.receiver == user_profile:
            text.seen = True
            text.save()

    context = {
        'friend_object': friend_user_object,
        'friend_profile': friend_profile,
        'user_profile': user_profile,
        'texts': texts,
        'form': form,
    }

    return render(request, 'chat.html', context)


def sentMessage(request, pk):
    friend_object = User.objects.get(username=pk)
    friend_profile = Profile.objects.get(user=friend_object)
    user_profile = Profile.objects.get(user=request.user)
    data = json.loads(request.body)
    body = data["msg"]

    new_message = Message.objects.create(body=body, sender=user_profile, receiver=friend_profile, seen=False)
    new_message.save()

    return JsonResponse(new_message.body, safe=False)


def receivedMessage(request, pk):
    friend_object = User.objects.get(username=pk)
    friend_profile = Profile.objects.get(user=friend_object)
    user_profile = Profile.objects.get(user=request.user)

    arr = []
    chats = Message.objects.filter(sender=friend_profile, receiver=user_profile).order_by('-timestamp')
    for chat in chats:
        chat.seen = True
        chat.save()
        arr.append(chat.body)

    return JsonResponse(arr, safe=False)


@login_required(login_url='signin')
def profile(request, pk):
    user_object = User.objects.get(username=pk)
    user_profile = Profile.objects.get(user=user_object)
    user_projects = user_profile.project_set.all()

    context = {
        'user_object': user_object,
        'user_profile': user_profile,
    }

    return render(request, 'profile.html',
                  {'user_profile': user_profile, 'user_object': user_object, 'projects': user_projects})


@login_required(login_url='signin')
def workspace(request, pk):
    user_project = Project.objects.get(id=pk)  # user_project is the object of a specific project under the user we are logged in
    project_tracks = user_project.track_set.all()
    form2 = ProjectForm(request.POST or None, request.FILES or None, instance=user_project)

    if form2.is_valid():
        print('--- VALID FORM ---')
        form2.save()
        return JsonResponse({'message': 'works'})
    else:
        print('--- not valid ---')
        print(form2.errors)

    if request.method == 'POST':
        form1 = TrackForm(request.POST, request.FILES)

        if form1.is_valid():
            new_track = form1.save(commit=False)
            new_track.project = user_project
            new_track.save()



    return render(request, 'workspace.html',
                  {'user_project': user_project, 'project_tracks': project_tracks, 'form1': TrackForm,
                   'form2': form2})


@login_required(login_url='signin')
def setup(request):
    if request.method == 'POST':
        user_profile = Profile.objects.get(user=request.user)
        title = request.POST['title']

        new_project = Project.objects.create(title=title)
        new_project.save()
        user_profile.project_set.add(new_project)

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
            return redirect('create')
        else:
            messages.info(request, 'Credentials Invalid')
            return redirect('')
    else:
        return render(request, 'signin.html')


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
