import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background px-5 py-10 sm:items-center sm:justify-center sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">DailyLogr</h1>

          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            Sign in to continue documenting your day.
          </p>
        </header>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          Capture what happened. Build a useful history over time.
        </p>
      </div>
    </main>
  );
}
