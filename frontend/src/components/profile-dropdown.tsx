import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useAuthStore } from '@/stores/auth-store'

export function ProfileDropdown() {
  const [open, setOpen] = React.useState(false)
  const { auth } = useAuthStore()
  const user = auth.user

  const name = user ? user.email.split('@')[0] : 'Loan Officer'
  const email = user ? user.email : 'officer@altgrade.in'
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full border border-[rgba(92,140,58,0.25)] hover:bg-[#DEEED4]'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt='@altgrade' />
              <AvatarFallback className='bg-[#DEEED4] text-[#2D5A28] font-bold text-xs'>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 bg-white/95 border border-[rgba(92,140,58,0.18)] shadow-lg rounded-xl p-1.5' align='end' forceMount>
          <DropdownMenuLabel className='font-normal p-2'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-semibold text-[#1A2E1C]'>{name}</p>
              <p className='text-xs leading-none text-[#6B8F68]'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
          <DropdownMenuGroup>
            <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer text-sm'>
              Profile
              <DropdownMenuShortcut className='text-[#6B8F68] font-mono'>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer text-sm'>
              Billing
              <DropdownMenuShortcut className='text-[#6B8F68] font-mono'>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer text-sm'>
              Settings
              <DropdownMenuShortcut className='text-[#6B8F68] font-mono'>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className='text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] rounded-md cursor-pointer text-sm'>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
          <DropdownMenuItem className='text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-md cursor-pointer text-sm' onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut className='text-destructive/70 font-mono'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
