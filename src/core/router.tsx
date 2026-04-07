import { Outlet } from "react-router"
import { ThunderSDK } from "thunder-sdk"
import type { TablerIcon } from "@tabler/icons-react"
import type { RouteObject } from "react-router"

import { ListPage } from "@/core/crud/ListPage"
import { FormPage } from "@/core/crud/FormPage"

export type TRouteObject = {
  name?: string
  icon?: TablerIcon
  display?: boolean | (() => boolean)
  children?: TRouteObject[]
} & RouteObject

export const coreRoutes = ThunderSDK.getModuleNames()
  .map((name) => {
    if (!ThunderSDK.getMetadata(name)) {
      return
    }

    const module = ThunderSDK.getModule(name)

    const hasCreate = "create" in module
    const hasUpdate = "update" in module

    const children: TRouteObject[] = [
      {
        index: true,
        display: false,
        Component: () => <ListPage name={name} />,
      },
    ]

    if (hasCreate || hasUpdate) {
      children.push(
        {
          path: `/${name}/form`,
          display: false,
          Component: () => <FormPage name={name} />,
        },
        {
          path: `/${name}/form/:id`,
          display: false,
          Component: () => <FormPage name={name} />,
        }
      )
    }

    return {
      name: name,
      path: name,
      display: () =>
        ThunderSDK.isPermitted(name, "get") ||
        ThunderSDK.isPermitted(name, "create"),
      Component: () => <Outlet />,
      children,
    }
  })
  .filter(Boolean) as TRouteObject[]
