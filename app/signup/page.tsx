import { SignupForm } from "@/components/signup-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-linear-to-br from-slate-950 via-slate-900 to-orange-950">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
