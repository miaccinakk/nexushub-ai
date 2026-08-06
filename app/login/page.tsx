import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-left">
          <p className="font-mono text-xl font-medium uppercase tracking-[0.22em] text-primary">Lead Search Agent</p>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            Доступ ограничен. Введи email и пароль, чтобы продолжить.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
