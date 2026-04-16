import { type Row, flexRender } from "@tanstack/react-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function UniversalCard<TData>({ row }: { row: Row<TData> }) {
  const cells = row.getVisibleCells()
  const titleCell = cells[0]
  const contentCells = cells.slice(1)
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <CardTitle className="truncate text-[1.1rem]">
          {titleCell ? flexRender(titleCell.column.columnDef.cell, titleCell.getContext()) : "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-start gap-4 py-4">
        {contentCells.map((cell) => {
          return (
            <div key={cell.id} className="flex flex-col gap-1 items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {typeof cell.column.columnDef.header === "string" 
                  ? cell.column.columnDef.header 
                  : flexRender(cell.column.columnDef.header, cell.getContext() as any)}
              </span>
              <span className="text-sm font-medium line-clamp-3 break-all">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
