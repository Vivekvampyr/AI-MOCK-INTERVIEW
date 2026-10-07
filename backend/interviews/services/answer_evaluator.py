import json
from django.conf import settings
from groq import Groq
from pydantic import BaseModel, Field

class AnswerEvaluationOutput(BaseModel):
    technical_score: float = Field(
        description="Technical accuracy score from 0 to 100"
    )

    communication_score: float = Field(
        description="Communication clarity score from 0 to 100"
    )

    completeness_score: float = Field(
        description="Completeness of the answer from 0 to 100"
    )

    overall_score: float = Field(
        description="Overall answer score from 0 to 100"
    )

    strengths: list[str] = Field(
        description="Key strengths of the answer"
    )

    improvements: list[str] = Field(
        description="Specific areas for improvement"
    )


class AnswerEvaluator:

    def __init__(self):
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not configured.")

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = settings.GROQ_MODEL

    def evaluate(
        self,
        question: str,
        answer: str,
        experience: str,
        tech_stack: list[str],
    ) -> AnswerEvaluationOutput:

        tech_stack_text = ", ".join(tech_stack)

        prompt = f"""
You are an expert technical interviewer evaluating a candidate's answer.

Candidate experience:
{experience}

Candidate technology stack:
{tech_stack_text}

Interview question:
{question}

Candidate answer:
{answer}

Evaluate the answer using these criteria:

1. Technical accuracy
2. Communication clarity
3. Completeness
4. Overall quality

Scoring rules:

- Scores must be between 0 and 100.
- Do not give high scores just because the answer is long.
- Technical correctness is more important than length.
- Penalize incorrect technical claims.
- Penalize missing important concepts.
- Communication should evaluate clarity, structure, and readability.
- Completeness should evaluate whether the question was adequately answered.
- Overall score should reflect the quality of the complete answer.

Provide 1-3 concise strengths.
Provide 1-3 specific improvements.

Return only the structured evaluation.
"""

        schema = AnswerEvaluationOutput.model_json_schema()

        schema["additionalProperties"] = False

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict but fair technical interview evaluator.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "answer_evaluation",
                    "strict": True,
                    "schema": schema,
                },
            },
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError("Groq returned an empty evaluation.")

        data = json.loads(content)

        result = AnswerEvaluationOutput.model_validate(data)

        self.validate_scores(result)

        return result

    @staticmethod
    def validate_scores(
        result: AnswerEvaluationOutput,
    ):
        scores = [
            result.technical_score,
            result.communication_score,
            result.completeness_score,
            result.overall_score,
        ]

        for score in scores:
            if score < 0 or score > 100:
                raise ValueError(
                    "Evaluation scores must be between 0 and 100."
                )