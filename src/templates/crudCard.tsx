import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { UniversalCard } from "@/Card"

export interface CrudCardsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function CrudCardsGrid<TData, TValue>({
  columns,
  data,
}: CrudCardsProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const validCardRows = table.getRowModel().rows.filter(row => {
    const rawData = row.original as Record<string, any>
    return rawData?.card === true
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {validCardRows.length > 0 ? (
        validCardRows.map((row) => (
          <UniversalCard key={row.id} row={row} />
        ))
      ) : (
        <div className="col-span-full py-12 text-center text-sm text-muted-foreground border rounded-lg border-dashed">
          No records with card views enabled.
        </div>
      )}
    </div>
  )
}

export const cards = {
  Grid: CrudCardsGrid,
}
