"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-2">Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              tooltip={item.title} 
              asChild
              className="hover:bg-orange-500/10 hover:text-orange-400 data-[active=true]:bg-orange-500/20 data-[active=true]:text-orange-400 transition-all"
            >
              <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className="font-medium">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
