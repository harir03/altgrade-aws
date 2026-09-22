import { Link } from '@tanstack/react-router'
import { AltGradeLogo } from '@/components/altgrade-logo'
import { DotBackground } from '@/components/ui/dot-background'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#EEF3EB] text-[#142617] font-['Inter',-apple-system,sans-serif]">
      {/* Soft cloudy background gradient & subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(100%_70%_at_50%_0%,rgba(210,229,205,0.45)_0%,rgba(238,243,235,0)_100%)]" />
      <div className="relative z-[2] mx-auto flex w-full max-w-[440px] flex-col items-center justify-center space-y-3 px-4 py-8 sm:p-8">
        <div className="mb-2 flex items-center justify-center">
          <Link to='/pitch' className='hover:opacity-90 transition-opacity'>
            <AltGradeLogo variant="nav" theme="light" showSublabel={true} sublabelText="ALTERNATE CREDIT FOR ALL" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
