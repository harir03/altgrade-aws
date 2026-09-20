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
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-[#0C1A0F] transition-colors rounded-xl p-2'
            >
              <div className='flex aspect-square size-9 items-center justify-center rounded-lg bg-[#122415] text-[#8FC45A] border border-[#2F5527]/60 shadow-[0_0_12px_rgba(143,196,90,0.12)] shrink-0'>
                <svg
                  className='size-4 text-[#8FC45A]'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path d='M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z' />
                </svg>
              </div>
              <div className='grid flex-1 text-start leading-tight'>
                <div className='flex items-center gap-1.5'>
                  <span className='truncate font-headingNow font-black text-[15px] tracking-tight text-[#F4F8F1] uppercase'>
                    {activeTeam.name}
                  </span>
                  <span className='inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#142817] text-[#8FC45A] border border-[#2F5527]/60'>
                    v2.4
                  </span>
                </div>
                <span className='truncate text-[10.5px] font-mono text-[#8FC45A]/90 font-medium flex items-center gap-1.5 mt-0.5'>
                  <span className='size-1.5 rounded-full bg-[#8FC45A] animate-pulse inline-block' />
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto text-[#9BB096] size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <team.logo className='size-4 shrink-0' />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
