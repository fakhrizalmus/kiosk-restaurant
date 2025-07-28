"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import clsx from "clsx"
import { Calendar, Hamburger, Home, Inbox, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Transaction",
    url: "/transaction",
    icon: Home,
  },
  {
    title: "Pesanan",
    url: "/pesanan",
    icon: Hamburger,
  },
  {
    title: "Product",
    url: "/product",
    icon: Inbox,
  },
  {
    title: "Category",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Access",
    url: "#",
    icon: Settings,
  },
  {
    title: "Role",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={clsx(
                        "rounded-md",
                        isActive && "bg-[var(--primary)] text-white"
                      )}
                    >
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}