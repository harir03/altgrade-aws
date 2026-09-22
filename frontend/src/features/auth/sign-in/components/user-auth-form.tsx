import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const emailLower = data.email.toLowerCase()
    const targetDemoEmails = [
      'admin@altgrade.in',
      'admin@altgrade.com',
      'testadmin@altgrade.in',
      'hari@altgrade.in',
      'testhari@altgrade.in',
      'farmer@altgrade.in',
      'msme@altgrade.in',
    ]

    const isDemoProfile = targetDemoEmails.includes(emailLower)

    const handleAuth = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isDemoProfile && data.password !== 'Password@123') {
          reject(new Error('Invalid password. Please use Password@123 for demo profiles.'))
        } else {
          resolve(true)
        }
      }, 1500)
    })

    toast.promise(handleAuth, {
      loading: 'Signing in...',
      success: () => {
        setIsLoading(false)

        const isAdmin = ['admin@altgrade.in', 'admin@altgrade.com', 'testadmin@altgrade.in'].includes(emailLower)
        const role = isAdmin ? ['admin'] : ['user']

        const mockUser = {
          accountNo: 'ACC001',
          email: data.email,
          role: role,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        }

        auth.setUser(mockUser)
        auth.setAccessToken('mock-access-token')

        const defaultPath = isAdmin ? '/dashboard' : '/'
        const targetPath = isAdmin ? (redirectTo || defaultPath) : defaultPath
        navigate({ to: targetPath, replace: true })

        return `Welcome back, ${data.email}!`
      },
      error: (err: any) => {
        setIsLoading(false)
        return err.message || 'Authentication failed'
      },
    })
  }

  const fillDemoAccount = (email: string) => {
    form.setValue('email', email)
    form.setValue('password', 'Password@123')
  }

  return (
    <Form {...form}>
      {/* Quick Demo Logins Bar */}
      <div className="mb-2 space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#52734F]">
          Fast Demo Access
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => fillDemoAccount('admin@altgrade.in')}
            className="rounded-lg border border-[rgba(92,140,58,0.25)] bg-[#DEEED4] px-2.5 py-1 text-[11px] font-mono text-[#163819] font-medium hover:bg-[#CFE5C4] transition-colors"
          >
            👔 Loan Officer (admin)
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('farmer@altgrade.in')}
            className="rounded-lg border border-[rgba(92,140,58,0.20)] bg-[#F0F5EE] px-2.5 py-1 text-[11px] font-mono text-[#142617] font-medium hover:bg-[#E2EBDD] transition-colors"
          >
            🌾 Applicant (farmer)
          </button>
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#142617] text-sm font-medium">Email</FormLabel>
              <FormControl>
                <input
                  type="email"
                  placeholder='name@example.com'
                  className="w-full rounded-xl border border-[rgba(92,140,58,0.25)] bg-white px-3.5 py-2.5 text-sm text-[#142617] placeholder:text-[#52734F]/50 outline-none focus:border-[#5C8C3A] focus:ring-1 focus:ring-[#5C8C3A]/30 transition-colors font-mono"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel className="text-[#142617] text-sm font-medium">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='********'
                  className="w-full rounded-xl border border-[rgba(92,140,58,0.25)] bg-white px-3.5 py-2.5 text-sm text-[#142617] placeholder:text-[#52734F]/50 outline-none focus:border-[#5C8C3A] focus:ring-1 focus:ring-[#5C8C3A]/30 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-[#52734F] hover:text-[#142617] transition-colors'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C3320] hover:bg-[#2A4A30] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className='size-4 animate-spin' /> : <LogIn className='size-4' />}
          Sign in
        </button>
      </form>
    </Form>
  )
}
