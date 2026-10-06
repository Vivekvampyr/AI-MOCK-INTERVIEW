from dataclasses import dataclass

from clerk_backend_api import (
    AuthenticateRequestOptions,
    authenticate_request,
)

from clerk_backend_api.security.types import (
    AuthErrorReason,
)

from django.conf import settings

from rest_framework.authentication import (
    BaseAuthentication,
)

from rest_framework.exceptions import (
    AuthenticationFailed,
)


@dataclass
class ClerkUser:
    id: str
    payload: dict

    is_authenticated: bool = True
    is_anonymous: bool = False
    is_active: bool = True

    def __str__(self) -> str:
        return self.id


class ClerkAuthentication(
    BaseAuthentication
):
    def authenticate(self, request):

        state = authenticate_request(
            request,
            AuthenticateRequestOptions(
                secret_key=settings.CLERK_SECRET_KEY,
                authorized_parties=(
                    settings.CLERK_AUTHORIZED_PARTIES
                ),
                accepts_token=["session_token"],
            ),
        )

        if not state.is_signed_in:

            print("CLERK AUTH FAILED")
            print("Reason:", state.reason)
            print("Message:", state.message)

            if (
                state.reason
                is AuthErrorReason.SESSION_TOKEN_MISSING
            ):
                return None

            raise AuthenticationFailed(
                state.reason.name
                if state.reason
                else "unauthorized"
            )

        user = ClerkUser(
            id=state.payload["sub"],
            payload=state.payload,
        )

        return user, state

    def authenticate_header(self, request):
        return "Bearer"