from rest_framework import serializers
from .models import (Interview, InterviewQuestion, WarningEvent)

class InterviewQuestionSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "question_number",
            "question",
            "answer",
            "technical_score",
            "communication_score",
            "completeness_score",
            "overall_score",
            "feedback",
        ]


class WarningEventSerializer(
    serializers.ModelSerializer
):
    screenshot = serializers.SerializerMethodField()

    class Meta:
        model = WarningEvent
        fields = [
            "id",
            "question_number",
            "warning_type",
            "timestamp_seconds",
            "confidence",
            "screenshot",
            "created_at",
        ]

    def get_screenshot(self, obj):
        if not obj.screenshot:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.screenshot.url
            )

        return obj.screenshot.url


class InterviewSerializer(
    serializers.ModelSerializer
):
    questions = InterviewQuestionSerializer(
        many=True,
        read_only=True,
    )

    warnings = WarningEventSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Interview
        fields = [
            "id",
            "experience",
            "tech_stack",
            "total_questions",
            "current_question",
            "total_score",
            "status",
            "created_at",
            "updated_at",
            "questions",
            "warnings",
        ]