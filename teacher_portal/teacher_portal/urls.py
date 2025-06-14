from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.contrib.auth.views import LogoutView 

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path("", include("portal.urls")),
    path("", RedirectView.as_view(url="/students/", permanent=False)),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
]
