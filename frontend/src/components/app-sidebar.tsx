"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import clsx from "clsx"
import { Calendar, ChevronDown, ChevronRight, Hamburger, Home, Inbox, Key, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getInfoLogin, getRoles } from "./actions"

const items = [
  {
    id: 1,
    title: "Transaction",
    url: "/transaction",
    icon: Home,
  },
  {
    id: 2,
    title: "Pesanan",
    url: "/pesanan",
    icon: Hamburger,
  },
  {
    id: 3,
    title: "Product",
    url: "/product",
    icon: Inbox,
  },
  {
    id: 4,
    title: "Category",
    url: "/category",
    icon: Calendar,
  },
  {
    id: 5,
    title: 'Manage User Access',
    url: '#',
    icon: Settings,
    menu: [
      {
        id: 6,
        title: "Access",
        url: "/access",
        icon: Key,
      },
      {
        id: 7,
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
        ? item.menu.filter((sub: any) => permissions.includes(sub.id))
        : undefined
    }))
}

export function AppSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const [userAccess, setUserAccess] = useState<[]>([]);
  const [infoLogin, setInfoLogin] = useState<{}>({});
  const [filteredItems, setFilteredItems] = useState(items)

  const fetchInfoLogin = async () => {
    const res = await getInfoLogin();
    const res2 = await getRoles({ id: res.data.role_id });
    const array = JSON.parse(res2.permission);
    setInfoLogin(res.data);
    setUserAccess(array);
    setFilteredItems(filterMenu(items, array))
  }

  useEffect(() => {
    fetchInfoLogin();
  }, [])

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
                    {/* ITEM TANPA CHILD */}
                    {!hasChildren && (
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
                    )}

                    {/* ITEM DENGAN CHILD */}
                    {hasChildren && (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleMenu(item.title)}
                          className="rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.title}</span>
                          </div>

                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </SidebarMenuButton>

                        {isOpen && (
                          <div className="mt-1 ml-6 flex flex-col gap-1">
                            {item.menu?.map((sub: any) => {
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
                      </>
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
