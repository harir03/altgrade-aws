import React from 'react'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-[#DEEED4] data-[state=open]:text-[#1A3818] hover:bg-[#DEEED4]/70 transition-colors rounded-xl p-2'
              >
                <Avatar className='h-8 w-8 rounded-lg border border-[rgba(92,140,58,0.25)]'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg bg-[#DEEED4] text-[#2D5A28] font-bold text-xs'>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <span className='truncate font-semibold text-[#1A2E1C]'>{user.name}</span>
                  <span className='truncate text-xs text-[#6B8F68]'>{user.email}</span>
                </div>
                <ChevronsUpDown className='ms-auto size-4 text-[#6B8F68]' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-white/95 border border-[rgba(92,140,58,0.18)] shadow-lg p-1.5'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-2 py-1.5 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg border border-[rgba(92,140,58,0.2)]'>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className='rounded-lg bg-[#DEEED4] text-[#2D5A28] font-bold text-xs'>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold text-[#1A2E1C]'>{user.name}</span>
                    <span className='truncate text-xs text-[#6B8F68]'>{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
              <DropdownMenuGroup>
                <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer gap-2 p-2'>
                  <Sparkles className='size-4 text-[#3D7324]' />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
              <DropdownMenuGroup>
                <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer gap-2 p-2'>
                  <BadgeCheck className='size-4 text-[#6B8F68]' />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer gap-2 p-2'>
                  <CreditCard className='size-4 text-[#6B8F68]' />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer gap-2 p-2'>
                  <Bell className='size-4 text-[#6B8F68]' />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
              <DropdownMenuItem
                className='text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-md cursor-pointer gap-2 p-2'
                onClick={() => setOpen(true)}
              >
                <LogOut className='size-4' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
