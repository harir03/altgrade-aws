import { Link, useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <div className="w-full rounded-2xl border border-[rgba(92,140,58,0.22)] bg-white/85 backdrop-blur-md p-8 shadow-[0_12px_40px_rgba(20,38,23,0.08)]">
        <div className="flex flex-col gap-1 text-center mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-[#142617]">Sign in to AltGrade</h2>
          <p className="text-sm text-[#52734F]">
            Enter your credentials to access your account.
          </p>
        </div>
        <UserAuthForm redirectTo={redirect} />
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-[#52734F]">
            Don't have an account?{' '}
            <Link
              to='/sign-up'
              className="text-[#142617] font-semibold hover:text-[#5C8C3A] underline-offset-4 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-xs text-[#52734F]/70 text-center leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-[#52734F] hover:text-[#142617] underline transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-[#52734F] hover:text-[#142617] underline transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
