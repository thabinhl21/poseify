from django.shortcuts import render

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
    return render(request, 'login.html')

def signup_page(request):
    return render(request, 'signup.html')