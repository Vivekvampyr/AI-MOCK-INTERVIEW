from django.db import transaction

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

import traceback

from .models import (
    Interview,
    InterviewQuestion,
)

from .serializers import InterviewSerializer

from .services.question_generator import (
    QuestionGenerator,
)


class StartInterviewView(APIView):

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

        if (
            not isinstance(tech_stack, list)
            or not tech_stack
        ):
            return Response(
                {
                    "error": (
                        "At least one tech stack "
                        "is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = Interview.objects.create(
            clerk_user_id=request.user.id,
            experience=experience,
            tech_stack=tech_stack,
            total_questions=10,
            current_question=1,
            status="generating",
        )

        try:
            generator = QuestionGenerator()

            result = generator.generate(
                experience=experience,
                tech_stack=tech_stack,
            )

            with transaction.atomic():

                for item in result.questions:

                    InterviewQuestion.objects.create(
                        interview=interview,
                        question_number=item.number,
                        question=item.question,
                    )

                interview.status = "ready"
                interview.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

        except Exception as error:
            print("\n========== GROK ERROR ==========")
            print("ERROR:", repr(error))
            traceback.print_exc()
            print("================================\n")

            interview.status = "failed"

        serializer = InterviewSerializer(
            interview
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )