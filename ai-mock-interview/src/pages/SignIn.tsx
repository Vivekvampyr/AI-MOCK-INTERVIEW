import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-10">
      <SignIn />
    </main>
  );
}