import json

from django.conf import settings
from groq import Groq
from pydantic import BaseModel, Field


class InterviewQuestionOutput(BaseModel):
    number: int = Field(
        description="Question number from 1 to 10"
    )

    question: str = Field(
        description="Technical interview question"
    )


class InterviewQuestionsOutput(BaseModel):
    questions: list[InterviewQuestionOutput]


class QuestionGenerator:
    def __init__(self) -> None:
        if not settings.GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is not configured."
            )

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = settings.GROQ_MODEL

    def generate(
        self,
        experience: str,
        tech_stack: list[str],
    ) -> InterviewQuestionsOutput:

        tech_stack_text = ", ".join(tech_stack)

        prompt = f"""
You are an experienced technical interviewer.

Generate exactly 10 technical interview questions for a candidate.

Candidate experience:
{experience}

Candidate technology stack:
{tech_stack_text}

Requirements:
1. Generate exactly 10 questions.
2. Start with fundamental concepts.
3. Gradually increase the difficulty.
4. Cover the selected technologies.
5. Include practical and scenario-based questions.
6. Avoid duplicate or nearly identical questions.
7. Questions must match the candidate's experience level.
8. Do not provide answers.
9. Do not include greetings or explanations.
10. Number the questions from 1 to 10.

Return only the structured data.
"""

        schema = (
            InterviewQuestionsOutput.model_json_schema()
        )

        # Groq strict structured outputs require
        # additionalProperties=false on every object.
        schema["additionalProperties"] = False

        if "$defs" in schema:
            question_schema = schema["$defs"].get(
                "InterviewQuestionOutput"
            )

            if question_schema:
                question_schema[
                    "additionalProperties"
                ] = False

        response = (
            self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an experienced "
                            "technical interviewer."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "interview_questions",
                        "strict": True,
                        "schema": schema,
                    },
                },
            )
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError(
                "Groq returned an empty response."
            )

        try:
            data = json.loads(content)
        except json.JSONDecodeError as error:
            raise ValueError(
                "Groq returned invalid JSON."
            ) from error

        result = InterviewQuestionsOutput.model_validate(
            data
        )

        self.validate_questions(result.questions)

        return result

    @staticmethod
    def validate_questions(
        questions: list[InterviewQuestionOutput],
    ) -> None:

        if len(questions) != 10:
            raise ValueError(
                f"Expected 10 questions, got {len(questions)}."
            )

        numbers = [
            question.number
            for question in questions
        ]

        if numbers != list(range(1, 11)):
            raise ValueError(
                "Question numbers must be exactly 1 through 10."
            )

        for question in questions:
            if not question.question.strip():
                raise ValueError(
                    f"Question {question.number} is empty."
                )