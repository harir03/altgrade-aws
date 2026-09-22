import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

type TeamSwitcherProps = {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-[#DEEED4] data-[state=open]:text-[#1A3818] hover:bg-[#DEEED4]/70 transition-colors rounded-xl p-2'
            >
              <div className='flex aspect-square size-9 items-center justify-center rounded-lg bg-white/95 text-[#3D7324] border border-[rgba(92,140,58,0.22)] shadow-[0_1px_4px_rgba(92,140,58,0.12)] shrink-0'>
                <svg
                  className='size-4 text-[#3D7324]'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z' />
                </svg>
              </div>
              <div className='grid flex-1 text-start leading-tight'>
                <div className='flex items-center gap-1.5'>
                  <span className='truncate font-headingNow font-black text-[15px] tracking-tight text-[#1A2E1C] uppercase'>
                    {activeTeam.name}
                  </span>
                  <span className='inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#DEEED4] text-[#2D5A28] border border-[rgba(92,140,58,0.25)]'>
                    v2.4
                  </span>
                </div>
                <span className='truncate text-[10.5px] font-mono text-[#4A7836] font-medium flex items-center gap-1.5 mt-0.5'>
                  <span className='size-1.5 rounded-full bg-[#4A8F2D] animate-pulse inline-block' />
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto text-[#6B8F68] size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-white/95 border border-[rgba(92,140,58,0.18)] shadow-lg p-1.5'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-[#6B8F68] font-mono uppercase tracking-wider px-2 py-1'>
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className='gap-2 p-2 rounded-lg text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] cursor-pointer'
              >
                <div className='flex size-6 items-center justify-center rounded-md border border-[rgba(92,140,58,0.2)] bg-white'>
                  <team.logo className='size-4 shrink-0 text-[#3D7324]' />
                </div>
                <span className='font-medium text-sm'>{team.name}</span>
                <DropdownMenuShortcut className='text-[#6B8F68] font-mono'>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
            <DropdownMenuItem className='gap-2 p-2 rounded-lg text-[#1A2E1C] hover:bg-[#DEEED4] focus:bg-[#DEEED4] cursor-pointer'>
              <div className='flex size-6 items-center justify-center rounded-md border border-[rgba(92,140,58,0.2)] bg-white'>
                <Plus className='size-4 text-[#3D7324]' />
              </div>
              <div className='font-medium text-sm text-[#4A7836]'>Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
