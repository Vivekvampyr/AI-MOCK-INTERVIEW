from django.urls import path

from .views import StartInterviewView


urlpatterns = [
    path(
        "start/",
        StartInterviewView.as_view(),
        name="start-interview",
    ),
]