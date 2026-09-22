import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">DailyLogr</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue documenting.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
