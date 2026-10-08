from django.db import models


class Interview(models.Model):
    EXPERIENCE_CHOICES = [
        ("fresher", "Fresher"),
        ("1-2", "1–2 Years"),
        ("3-5", "3–5 Years"),
        ("5+", "5+ Years"),
    ]

    clerk_user_id = models.CharField(
        max_length=255,
        db_index=True,
    )

    experience = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES,
    )

    tech_stack = models.JSONField(
        default=list,
    )

    total_questions = models.PositiveIntegerField(
        default=10,
    )

    current_question = models.PositiveIntegerField(
        default=1,
    )

    total_score = models.FloatField(
        null=True,
        blank=True,
    )

    duration_seconds = models.PositiveIntegerField(
        null=True,
        blank=True,
    )

    recording = models.FileField(
        upload_to="interview_recordings/",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        default="created",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self) -> str:
        return f"Interview {self.id} - {self.clerk_user_id}"

class InterviewQuestion(models.Model):
    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name="questions",
    )

    question_number = models.PositiveIntegerField()

    question = models.TextField()

    answer = models.TextField(
        blank=True,
    )

    technical_score = models.FloatField(
        null=True,
        blank=True,
    )

    communication_score = models.FloatField(
        null=True,
        blank=True,
    )

    completeness_score = models.FloatField(
        null=True,
        blank=True,
    )

    overall_score = models.FloatField(
        null=True,
        blank=True,
    )

    feedback = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["question_number"]

    def __str__(self) -> str:
        return (
            f"Interview {self.interview_id} "
            f"- Question {self.question_number}"
        )

class WarningEvent(models.Model):
    WARNING_TYPES = [
        ("lip_movement", "Lip Movement"),
        ("eye_movement", "Eye Movement"),
        ("smart_device", "Smart Device"),
    ]

    interview = models.ForeignKey(
        Interview,
        on_delete=models.CASCADE,
        related_name="warnings",
    )

    question_number = models.PositiveIntegerField()

    warning_type = models.CharField(
        max_length=30,
        choices=WARNING_TYPES,
    )

    timestamp_seconds = models.FloatField()

    confidence = models.FloatField(
        null=True,
        blank=True,
    )

    screenshot = models.ImageField(
        upload_to="warning_screenshots/",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self) -> str:
        return (
            f"Warning {self.id} - "
            f"{self.warning_type}"
        )

