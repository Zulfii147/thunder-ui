/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { hash } from "ohash"
import { ThunderSDK } from "thunder-sdk"
import { DataTable } from "../custom/Datatable"
import { cards } from "@/templates/crudCard"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { use } from "../hooks/use"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconAlertCircle } from "@tabler/icons-react"

export interface IListPageProps {
  name: string
}

const columnsFromModuleMetadata = (metadata: any): ColumnDef<unknown>[] => {
  if (!metadata) return []

  if (typeof metadata.crud?.schema !== "object") return []

  // Convert json schema to columns
  return Object.entries<{
    type: string
    format?: string
  }>(metadata.crud.schema.properties).map(([key]) => ({
    accessorKey: key,
    header: key,
  }))
}

export function ListPage({ name }: IListPageProps) {
  const navigate = useNavigate()
  const metadata = React.useMemo(() => ThunderSDK.getMetadata(name), [name])

  const get = React.useCallback(
    (query: Record<string, unknown> = {}) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return ThunderSDK.useCaching(
        [name, query && hash(query)],
        async ({ signal }) =>
          (await ThunderSDK.getModule(name).get({
            signal,
            query,
          })) as { results: unknown[] },
        { cacheTTL: parseInt(import.meta.env.VITE_DEFAULT_CACHE_TTL ?? "1") }
      )
    },
    [name]
  )

  const { data, error } = use(get())
  const [isCardView, setIsCardView] = React.useState(false)
  const hasCardSupport = data?.results?.some((item: any) => item?.card === true) ?? false

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5">
      {error && (
        <Alert variant="destructive">
          <IconAlertCircle />
          <AlertTitle>Error Occurred!</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-center">
        <div>
          {ThunderSDK.isPermitted(ThunderSDK.getModule(name).create) && (
            <Button onClick={() => navigate("form")}>Create</Button>
          )}
        </div>
        <div>
          {hasCardSupport && (
            <Button variant="outline" onClick={() => setIsCardView(!isCardView)}>
              {isCardView ? "View Table" : "View Card"}
            </Button>
          )}
        </div>
      </div>
      <div>
        {isCardView ? (
          <cards.Grid
            columns={columnsFromModuleMetadata(metadata)}
            data={data?.results ?? []}
          />
        ) : (
          <DataTable
            columns={columnsFromModuleMetadata(metadata)}
            data={data?.results ?? []}
          />
        )}
      </div>
    </div>
  )
}
