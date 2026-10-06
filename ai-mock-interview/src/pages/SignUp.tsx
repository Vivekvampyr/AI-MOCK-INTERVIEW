import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-10">
      <SignUp />
    </main>
  );
}