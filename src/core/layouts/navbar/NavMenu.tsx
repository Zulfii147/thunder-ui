import { Link, useLocation } from "react-router"
import type { TablerIcon } from "@tabler/icons-react"
import { IconChevronDown } from "@tabler/icons-react"
import React from "react"
import { cn } from "@/lib/utils"

export interface INavMenuItem {
  title: string
  path?: string
  icon?: TablerIcon
  items?: {
    title: string
    path?: string
    icon?: TablerIcon
  }[]
}

export interface INavMenuProps {
  items: Array<INavMenuItem>
}

function NavItem({ item }: { item: INavMenuItem }) {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasSubItems = item.items && item.items.length > 0
  const isActive =
    location.pathname === `/${item.path}` ||
    item.items?.some((sub) => location.pathname === `/${sub.path}`)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  if (hasSubItems) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to={item.path || "#"}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-navbar-foreground/70 transition-colors hover:bg-navbar-accent hover:text-navbar-accent-foreground",
            isActive && "font-semibold text-navbar-foreground"
          )}
        >
          {item.icon && <item.icon className="size-4 shrink-0 opacity-70" />}
          <span>{item.title}</span>
          <IconChevronDown
            className={cn(
              "size-3 opacity-45 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Link>

        {open && (
          <div className="absolute top-full left-0 z-60 animate-in fade-in slide-in-from-top-1 pt-2 duration-150">
            <div className="min-w-48 rounded-lg border border-navbar-border bg-navbar text-navbar-foreground p-1 shadow-xl shadow-black/30">
              {item.items?.map((subItem) => {
                const subActive = location.pathname === `/${subItem.path}`
                return (
                  <Link
                    key={subItem.title}
                    to={subItem.path || "#"}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-[0.8125rem] font-[450] text-navbar-foreground/70 transition-colors hover:bg-navbar-accent hover:text-navbar-accent-foreground",
                      subActive && "bg-navbar-accent font-semibold text-navbar-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {subItem.icon && (
                      <subItem.icon className="size-4 shrink-0 opacity-55" />
                    )}
                    <span>{subItem.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      to={item.path || "#"}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-navbar-foreground/70 transition-colors hover:bg-navbar-accent hover:text-navbar-accent-foreground",
        isActive && "font-semibold text-navbar-foreground"
      )}
    >
      {item.icon && <item.icon className="size-4 shrink-0 opacity-70" />}
      <span>{item.title}</span>
    </Link>
  )
}

export function NavMenu({ items }: INavMenuProps) {
  return (
    <>
      {items.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </>
  )
}
