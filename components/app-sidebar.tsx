"use client"

import * as React from "react"
import {
  BookOpen,
  Merge,
  PieChart,
  Search,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Burrow Explorer",
    email: "explorer@burrow.app",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: false,
      items: [],
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
      isActive: true,
      items: [],
    },
    {
      title: "Graph View",
      url: "/knn",
      icon: Merge,
      items: [],
    },
    {
      title: "Feed",
      url: "/feed",
      icon: BookOpen,
      items: [],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800/50 bg-slate-900" {...props}>
      <SidebarHeader className="border-b border-slate-800/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">Burrow</span>
            <span className="text-slate-400 text-xs">Knowledge Explorer</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-800/50">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
