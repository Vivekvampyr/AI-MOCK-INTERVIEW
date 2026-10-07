from django.urls import path

from .views import (
    StartInterviewView,
    SubmitAnswerView,
    InterviewListView,
)


urlpatterns = [
    path(
        "",
        InterviewListView.as_view(),
        name="interview-list",
    ),
    path(
        "start/",
        StartInterviewView.as_view(),
        name="start-interview",
    ),
    path(
        "<int:interview_id>/answer/",
        SubmitAnswerView.as_view(),
        name="submit-answer",
    ),
]