import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { getCookie } from '@/lib/cookies'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    let token = ''
    try {
      const cookieState = getCookie('thisisjustarandomstring')
      token = cookieState ? JSON.parse(cookieState) : ''
    } catch {
      token = ''
    }

    if (!token) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    try {
      const savedUser = localStorage.getItem('altgrade-user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (!user.role?.includes('admin')) {
          throw redirect({ to: '/' })
        }
      }
    } catch {
      // ignore parse error
    }
  },
  component: AuthenticatedLayout,
})
