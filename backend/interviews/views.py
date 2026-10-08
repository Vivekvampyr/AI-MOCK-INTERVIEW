from django.db import transaction

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .services.answer_evaluator import AnswerEvaluator

import traceback

from .models import (
    Interview,
    InterviewQuestion,
    WarningEvent
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

class SubmitAnswerView(APIView):

    def post(self, request, interview_id):

        answer = request.data.get("answer")
        question_number = request.data.get("question_number")

        if not answer or not answer.strip():
            return Response(
                {"error": "Answer is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if question_number is None:
            return Response(
                {"error": "Question number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            question_number = int(question_number)
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid question number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = get_object_or_404(
            Interview,
            id=interview_id,
            clerk_user_id=request.user.id,
        )

        question = get_object_or_404(
            InterviewQuestion,
            interview=interview,
            question_number=question_number,
        )

        try:
            evaluator = AnswerEvaluator()

            evaluation = evaluator.evaluate(
                question=question.question,
                answer=answer.strip(),
                experience=interview.experience,
                tech_stack=interview.tech_stack,
            )

        except Exception as error:
            print("Answer evaluation failed:", repr(error))

            return Response(
                {
                    "error": "Failed to evaluate answer. Please try again."
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        question.answer = answer.strip()
        question.technical_score = evaluation.technical_score
        question.communication_score = evaluation.communication_score
        question.completeness_score = evaluation.completeness_score
        question.overall_score = evaluation.overall_score
        question.feedback = {
            "strengths": evaluation.strengths,
            "improvements": evaluation.improvements,
        }

        question.save(
            update_fields=[
                "answer",
                "technical_score",
                "communication_score",
                "completeness_score",
                "overall_score",
                "feedback",
            ]
        )

        is_last_question = (
            question_number == interview.total_questions
        )

        if is_last_question:

            completed_questions = interview.questions.all()

            scores = [
                q.overall_score
                for q in completed_questions
                if q.overall_score is not None
            ]

            total_score = (
                sum(scores) / len(scores)
                if scores
                else None
            )

            interview.current_question = interview.total_questions
            interview.total_score = total_score
            interview.status = "completed"

            interview.save(
                update_fields=[
                    "current_question",
                    "total_score",
                    "status",
                    "updated_at",
                ]
            )

            serializer = InterviewSerializer(interview)

            return Response(
                {
                    "message": "Interview completed successfully.",
                    "question_number": question_number,
                    "completed": True,
                    "interview": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        interview.current_question = question_number + 1
        interview.status = "in_progress"

        interview.save(
            update_fields=[
                "current_question",
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "message": "Answer evaluated and saved successfully.",
                "question_number": question_number,
                "completed": False,
                "evaluation": {
                    "technical_score": evaluation.technical_score,
                    "communication_score": evaluation.communication_score,
                    "completeness_score": evaluation.completeness_score,
                    "overall_score": evaluation.overall_score,
                    "feedback": {
                        "strengths": evaluation.strengths,
                        "improvements": evaluation.improvements,
                    },
                },
            },
            status=status.HTTP_200_OK,
        )

class TerminateInterviewView(APIView):

    def post(self, request, interview_id):

        interview = get_object_or_404(
            Interview,
            id=interview_id,
            clerk_user_id=request.user.id,
        )

        if interview.status == "completed":
            return Response(
                {
                    "error": "Completed interviews cannot be terminated."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview.status = "terminated"

        interview.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            {
                "message": "Interview terminated successfully.",
                "status": interview.status,
            },
            status=status.HTTP_200_OK,
        )

class InterviewListView(APIView):
    def get(self, request):
        interviews = Interview.objects.filter(
            clerk_user_id=request.user.id,
            status="completed",
        ).order_by("-created_at")

        serializer = InterviewSerializer(
            interviews,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class CreateWarningEventView(APIView):

    def post(self, request, interview_id):

        warning_type = request.data.get("warning_type")
        question_number = request.data.get("question_number")
        timestamp_seconds = request.data.get("timestamp_seconds")
        confidence = request.data.get("confidence")

        allowed_types = [
            "lip_movement",
            "eye_movement",
            "smart_device",
        ]

        if warning_type not in allowed_types:
            return Response(
                {"error": "Invalid warning type."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if question_number is None:
            return Response(
                {"error": "Question number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if timestamp_seconds is None:
            return Response(
                {"error": "Timestamp is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            question_number = int(question_number)
            timestamp_seconds = float(timestamp_seconds)

            if confidence is not None:
                confidence = float(confidence)

        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid warning event values."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        interview = get_object_or_404(
            Interview,
            id=interview_id,
            clerk_user_id=request.user.id,
        )

        warning = WarningEvent.objects.create(
            interview=interview,
            question_number=question_number,
            warning_type=warning_type,
            timestamp_seconds=timestamp_seconds,
            confidence=confidence,
        )

        return Response(
            {
                "message": "Warning event saved successfully.",
                "warning": {
                    "id": warning.id,
                    "warning_type": warning.warning_type,
                    "question_number": warning.question_number,
                    "timestamp_seconds": warning.timestamp_seconds,
                    "confidence": warning.confidence,
                },
            },
            status=status.HTTP_201_CREATED,
        )