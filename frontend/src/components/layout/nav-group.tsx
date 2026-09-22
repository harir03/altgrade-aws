import { type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-[10.5px] font-mono uppercase tracking-wider text-[#6B8F68] font-semibold px-2'>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1.5 py-0 text-[10px] bg-[#DEEED4] text-[#2D5A28] border border-[rgba(92,140,58,0.25)] font-semibold shadow-none'>{children}</Badge>
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar()
  const active = checkIsActive(href, item)
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.title}
        className={cn(
          'transition-all duration-150 rounded-lg text-[13.5px] font-medium h-9 px-2.5',
          active
            ? 'bg-[#DEEED4] text-[#1A3818] font-semibold shadow-xs border border-[rgba(92,140,58,0.22)]'
            : 'text-[#2B4728] hover:bg-[#DEEED4]/60 hover:text-[#1A2E1C]'
        )}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon className={cn('size-4', active ? 'text-[#3D7324]' : 'text-[#6B8F68]')} />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { setOpenMobile } = useSidebar()
  const active = checkIsActive(href, item, true)
  return (
    <Collapsible
      asChild
      defaultOpen={active}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className='text-[#2B4728] hover:bg-[#DEEED4]/60 hover:text-[#1A2E1C] rounded-lg h-9 px-2.5 font-medium text-[13.5px]'
          >
            {item.icon && <item.icon className='size-4 text-[#6B8F68]' />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180 size-4 text-[#6B8F68]' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub className='border-l border-[rgba(92,140,58,0.18)] ml-4 pl-2'>
            {item.items.map((subItem) => {
              const subActive = checkIsActive(href, subItem)
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={subActive}
                    className={cn(
                      'rounded-md text-[13px] h-8 px-2',
                      subActive
                        ? 'bg-[#DEEED4] text-[#1A3818] font-semibold'
                        : 'text-[#2B4728] hover:bg-[#DEEED4]/60 hover:text-[#1A2E1C]'
                    )}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon className={cn('size-3.5', subActive ? 'text-[#3D7324]' : 'text-[#6B8F68]')} />}
                      <span>{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
            className='text-[#2B4728] hover:bg-[#DEEED4]/60 hover:text-[#1A2E1C] rounded-lg'
          >
            {item.icon && <item.icon className='size-4 text-[#6B8F68]' />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4 text-[#6B8F68]' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4} className='bg-white/95 border border-[rgba(92,140,58,0.18)] shadow-lg rounded-xl p-1.5'>
          <DropdownMenuLabel className='text-xs font-semibold text-[#1A2E1C]'>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='bg-[rgba(92,140,58,0.15)] my-1' />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                to={sub.url}
                className={cn(
                  'gap-2 p-2 rounded-lg text-[#1A2E1C] hover:bg-[#DEEED4] cursor-pointer text-sm',
                  checkIsActive(href, sub) && 'bg-[#DEEED4] font-semibold text-[#1A3818]'
                )}
              >
                {sub.icon && <sub.icon className='size-4 text-[#3D7324]' />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && (
                  <span className='ms-auto text-xs px-1.5 py-0.2 rounded bg-[#DEEED4] text-[#2D5A28] border border-[rgba(92,140,58,0.2)]'>{sub.badge}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
