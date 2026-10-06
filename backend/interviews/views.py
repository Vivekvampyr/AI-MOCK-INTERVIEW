from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Interview
from .serializers import InterviewSerializer


class StartInterviewView(APIView):

    def post(self, request):
        print("🔥 START INTERVIEW API HIT")
        print("USER:", request.user)
        print("DATA:", request.data)

    def post(self, request):

        experience = request.data.get(
            "experience"
        )

        tech_stack = request.data.get(
            "techStack"
        )

        if not experience:
            return Response(
                {
                    "error": "Experience is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(
            tech_stack,
            list
        ) or not tech_stack:

            return Response(
                {
                    "error": "At least one tech stack is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = Interview.objects.create(
            clerk_user_id=request.user.id,
            experience=experience,
            tech_stack=tech_stack,
            total_questions=10,
            current_question=1,
            status="created",
        )

        serializer = InterviewSerializer(
            interview
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )