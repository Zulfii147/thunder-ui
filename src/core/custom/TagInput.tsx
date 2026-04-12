import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import React from "react"

export type TTagValue = "text" | "number" | "url" | "email" | "phone"

type TagInputProps = {
  values?: TTagValue[]
  onValueChange?: (value: TTagValue[]) => void
} & React.ComponentProps<typeof Input>

const TagInputContext = React.createContext<TagInputProps | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useTag() {
  const ctx = React.useContext(TagInputContext) as TagInputProps | null
  if (!ctx) throw new Error("Must be used inside TagInputProvider")
  return ctx
}

export function Tag({
  children,
  ...props
}: TagInputProps & { children: React.ReactNode }) {
  return (
    <TagInputContext.Provider value={props}>
      {children}
    </TagInputContext.Provider>
  )
}

export function TagInput() {
  const { values, onValueChange, ...inputProps } = useTag()

  return (
    <Input
      {...inputProps}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()

          if (!e.currentTarget.checkValidity()) {
            e.currentTarget.reportValidity()

            return
          }

          const value = (
            inputProps.type === "number"
              ? e.currentTarget.valueAsNumber
              : e.currentTarget.value
          ) as TTagValue
          onValueChange?.([value, ...(values ?? [])])

          e.currentTarget.value = ""
        }
      }}
    />
  )
}

export function TagInputBadges() {
  const { values: _values, onValueChange } = useTag()

  const values = _values ?? []

  return (
    <>
      {values.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {values.map((tag, idx) => (
            <Badge key={idx}>
              {tag}{" "}
              <li
                className="cursor-pointer list-none"
                onClick={() => onValueChange?.(values.filter((v) => v !== tag))}
              >
                <IconX className="size-4" />
              </li>
            </Badge>
          ))}
        </div>
      ) : null}

      {values.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant={"link"}
            size={"xs"}
            className="text-primary no-underline!"
            onClick={() => onValueChange?.([])}
          >
            Clear all
          </Button>
        </div>
      )}
    </>
  )
}
