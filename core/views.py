from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.models import User, auth
from .models import Profile, Project, Message, Track
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.utils.text import slugify
from core.forms import SignInForm, SettingsForm, ChatMessageForm, CreateProjectForm, ProjectForm, TrackForm, SignUpForm
from django.contrib import messages
from django.db.models import Q
import os
from mixtape import settings as s


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
    unread = Message.objects.filter(seen=False, receiver=user_profile).count()

    if last_text:
        last_text_user = Profile.objects.get(user=last_text.sender.user)
    else:
        last_text_user = None

    if request.method == 'POST':
        # retrieve type of POST and project id from hidden inputs
        form_type = request.POST.get('form_type')
        project_id = request.POST.get('project_id')
        if form_type == 'delete_project':

            selected_project = get_object_or_404(user_projects, id=project_id)
            selected_project.delete()
            return redirect('create')

        elif form_type == 'favorite_project':
            selected_project = get_object_or_404(user_projects, id=project_id)
            user_profile.fav_proj = selected_project
            user_profile.save()

    # creates color palette based on pfp
    profile_image_path = user_profile.profileimg.url
    profile_image_absolute_path = os.path.join(s.MEDIA_ROOT, profile_image_path.strip('/media'))

    context = {
        'user_profile': user_profile,
        'user_projects': user_projects,
        'last_text': last_text,
        'last_text_user': last_text_user,
        'unread': unread,
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
        form.save()
        messages.success(request, 'Your settings have been updated.')
        form = SettingsForm()
        return redirect('settings')

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
    user_project = Project.objects.get(id=pk)
    project_tracks = user_project.track_set.all()

    # Initialize form1 outside the POST check so it's available for the context
    form1 = TrackForm()
    form2 = ProjectForm(instance=user_project)

    if request.method == 'POST':
        form_type = request.POST.get('form_type')

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':

            if form_type == 'track':
                form1 = TrackForm(request.POST, request.FILES)
                if form1.is_valid():
                    new_track = form1.save(commit=False)
                    new_track.project = user_project
                    new_track.save()
                    return JsonResponse({'status': 'success', 'message': 'Track added successfully'})
                else:
                    return JsonResponse({'status': 'error', 'errors': form1.errors})

            elif form_type == 'project':
                form2 = ProjectForm(request.POST, request.FILES, instance=user_project)
                if form2.is_valid():
                    form2.save()
                    return JsonResponse({'status': 'success', 'message': 'Project updated successfully'})
                else:
                    return JsonResponse({'status': 'error', 'errors': form2.errors})

        else:
            if form_type == 'delete_project':
                user_project.delete()
                return redirect('/create')

    return render(request, 'workspace.html', {
        'user_project': user_project,
        'project_tracks': project_tracks,
        'form1': form1,
        'form2': form2
    })


@login_required(login_url='signin')
def setup(request):
    user_profile = Profile.objects.get(user=request.user)

    form = CreateProjectForm(request.POST or None, request.FILES or None)

    if form.is_valid():
        new_project = form.save(commit=False)
        new_project.save()
        new_project.profile.set([user_profile])
        print(new_project)
        return JsonResponse(
            {'message': 'Project created successfully', 'redirect_url': f'/workspace/{slugify(new_project.id)}'})

    else:
        print(form.errors)

    return render(request, 'setup.html', {'form': form})


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            print('form is valid')
            user = form.save()
            user_login = authenticate(username=user.username, password=form.cleaned_data['password1'])
            print(user)
            print(user_login)

            Profile.objects.create(user=user)
            login(request, user_login)

            return JsonResponse({'message': 'Registered successfully', 'redirect_url': '/create'})

        else:
            # Handle form errors
            errors = form.errors.as_json()
            return JsonResponse({'message': 'Registration failed', 'errors': errors}, status=400)

    else:
        form = SignUpForm()

    return render(request, "signup.html", {'form': form})
# def signup(request):
#     if request.method == 'POST':
#         email = request.POST['email']
#         username = request.POST['username']
#         password = request.POST['password']
#
#         if User.objects.filter(email=email).exists():
#             messages.info(request, 'Email Taken')
#             return redirect('signup')
#
#         elif User.objects.filter(username=username).exists():
#             messages.info(request, 'Username Taken')
#             return redirect('signup')
#
#         else:
#             user = User.objects.create_user(email=email, username=username, password=password)
#             user.save()
#
#             # Log user in and redirect to creates page
#             user_login = auth.authenticate(username=username, password=password)
#             auth.login(request, user_login)
#
#             user_model = User.objects.get(username=username)
#             new_profile = Profile.objects.create(user=user_model)
#             new_profile.save()
#
#             return redirect('create')
#
#
#     else:
#         return render(request, 'signup.html')




def signin(request):
    if request.method == 'POST':
        form = SignInForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            return JsonResponse({'message': 'Signed in successfully', 'redirect_url': '/create'})
        else:
            errors = form.errors.as_json()
            non_field_errors = form.non_field_errors()  # Grab non-field errors
            return JsonResponse(
                {'message': 'Invalid credentials', 'errors': errors, 'non_field_errors': list(non_field_errors)},
                status=400)
    else:
        form = SignInForm()
    return render(request, "login.html", {'form': form})


def logout_view(request):
    logout(request)
    return redirect('signin')


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
