from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .forms import SignupForm
from django.contrib.auth import authenticate, login, logout
# Create your views here.

def home_page(request):
    return render(request, "home.html")

def account_page(request):
    return render(request, 'account.html')

def upload_page(request):
    return render(request, 'upload.html')

def shoot_page(request):
    return render(request, 'shoot.html')

def login_page(request):

    # if request.method == 'POST':
    #     username = request.POST.get('inputName')
    #     password = request.POST.get('inputPassword')

    #     user = authenticate(request, username=username, password=password)

    #     if user is not None:
    #         login(request, username)
    #         return redirect('')

    # return render(request, 'login.html')
    if request.method=="POST":
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("inputName")
            password = form.cleaned_data.get("inputPassword")
            user = authenticate(request=request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html',{'form':form})

def signup_page(request):
    # form = CreateUserForm()

    # if request.method == 'POST':
    #     form = CreateUserForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return redirect('login')


    # context = {'form':form}
    # return render(request, 'signup.html', context)
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/')
        else:
            print(form.errors)
    else:
        form = SignupForm()
    return render(request, 'signup.html',{'form':form})