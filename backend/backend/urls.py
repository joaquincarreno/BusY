"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path

from api.views import apiTest, getZones777, getGPS, getStops, getAvailableRoutes, getAvailableBuses, getAvailableDirections, deviationScore, listDeviationScore


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', apiTest),
    path('api/zones777/', getZones777),
    path('api/gps/<str:recorrido>/', getGPS),
    path('api/gps/<str:recorrido>/<str:patente>/', getGPS),
    path('api/gps/<str:recorrido>/<str:patente>/<str:sentido>/', getGPS),
    path('api/gps/', getGPS),
    path('api/stops/', getStops),
    path('api/stops/<str:recorrido>', getStops),
    path('api/stops/<str:recorrido>/<str:sentido>', getStops),
    path('api/availableRoutes/', getAvailableRoutes),
    path('api/availableBuses/', getAvailableBuses),
    path('api/availableBuses/<str:recorrido>', getAvailableBuses),
    path('api/availableBuses/<str:recorrido>/<str:sentido>', getAvailableBuses),
    path('api/availableDirections/<str:recorrido>/<str:patente>', getAvailableDirections),
    path('api/deviationScore/<str:recorrido>/<str:patente>/<str:sentido>', deviationScore),
    path('api/listDeviationScore/<str:recorrido>', listDeviationScore),
]