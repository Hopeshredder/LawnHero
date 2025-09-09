"""
URL configuration for LawnHero_proj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/v1/users/", include(("users_app.urls", "users_app"), namespace="users_app")
    ),
    path("api/v1/yard_pref/", include("yard_preferences_app.urls")),
    path("api/v1/yards/", include("yard_app.urls")),
    path("api/v1/tasks/", include("task_app.urls")),
    path("api/v1/tips/", include("supertips_app.urls")),
]
