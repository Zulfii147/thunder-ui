import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Dropdown: typeof Select = (props) => {
  const items =
    typeof props.items === "object" && !(props.items instanceof Array)
      ? Object.entries(props.items).map(([value, label]) => ({ label, value }))
      : props.items

  return (
    <Select {...props}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{props.name}</SelectLabel>
          {items?.map((item) => (
            <SelectItem key={item.value ?? item} value={item.value ?? item}>
              {item.label ?? item.value ?? item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
