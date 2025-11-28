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
import { Calendar, ChevronDown, ChevronRight, Hamburger, Home, Inbox, Key, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
    url: "/category",
    icon: Calendar,
  },
  {
    title: 'Manage User Access',
    url: '#',
    icon: Settings,
    menu: [
      {
        title: "Access",
        url: "/access",
        icon: Key,
      },
      {
        title: "Role",
        url: "/role",
        icon: User,
      },
    ]
  }
]

const filterMenu = (menu: any[], permissions: number[]) => {
  return menu
    .filter(item => permissions.includes(item.id) || !item.id) // parent tanpa id tetap tampil
    .map(item => ({
      ...item,
      menu: item.menu
        ? item.menu.filter(sub => permissions.includes(sub.id))
        : undefined
    }))
}

export function AppSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const userAccess = [1, 3] // nanti ini dari backend
  const filteredItems = filterMenu(items, userAccess)

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }))
  }
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname === item.url
                const hasChildren = Array.isArray(item.menu)
                const isOpen = openMenus[item.title] || false
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!hasChildren}
                      onClick={
                        hasChildren
                          ? () => toggleMenu(item.title)
                          : undefined
                      }
                      className={clsx(
                        "rounded-md",
                        isActive && !hasChildren && "bg-[var(--primary)] text-white"
                      )}
                    >
                      {hasChildren ? (
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.title}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </div>
                      ) : (
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      )}
                    </SidebarMenuButton>
                    {hasChildren && isOpen && (
                      <div className="mt-1 ml-6 flex flex-col gap-1">
                        {item.menu?.map((sub) => {
                          const isSubActive = pathname === sub.url

                          return (
                            <SidebarMenuButton
                              key={sub.title}
                              asChild
                              className={clsx(
                                "rounded-md",
                                isSubActive && "bg-[var(--primary)] text-white"
                              )}
                            >
                              <a
                                href={sub.url}
                                className="flex items-center gap-2 px-2 py-1"
                              >
                                <sub.icon />
                                <span>{sub.title}</span>
                              </a>
                            </SidebarMenuButton>
                          )
                        })}
                      </div>
                    )}
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
