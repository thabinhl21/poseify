from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# from .forms import SignupForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .sms import *
# Create your views here.

def home_page(request):
    return render(request, "home.html")

def gallery_page(request):
    return render(request, 'gallery.html')

def upload_page(request):
    return render(request, 'upload.html')

def shoot_page(request):
    return render(request, 'shoot.html')

def login_page(request):

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
    
            login(request, user)
            num = request.POST.get('phone')
            # print(num)
            # global phoneNum
            phoneNum = "+1" + str(num)
            send = SendMsg()
            send.send_sms(phoneNum)
            # print(phoneNum)
            return redirect('')

        else:
            messages.success(request, ("There was an error logging in. Try again."))
            return redirect('login')
    
    else:
        return render(request, 'login.html')


def signup_page(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('inputName')
            password = form.cleaned_data.get('inputPassword')
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("Registration Successful!"))
            return redirect('')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form':form})