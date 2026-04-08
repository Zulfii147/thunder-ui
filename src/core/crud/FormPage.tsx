/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import { ThunderSDK } from "thunder-sdk"
import { toFields, type TField } from "../lib/jsonSchemaToFields"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"

// import { Multiselect } from "../custom/Multiselect"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Dropdown } from "../custom/Dropdown"
import { Textarea } from "@/components/ui/textarea"

const fieldsFromModuleMetadata = (metadata: any) => {
  if (!metadata) return []

  if (typeof metadata.crud?.insertSchema !== "object") return []

  // Convert json schema to fields data
  const results = toFields("data", metadata.crud.insertSchema)

  console.log(results)

  return results
}

const renderField = (id: string, field: TField) => {
  switch (field.type) {
    case "boolean":
      return <Switch id={id} name={field.name} required={field.required} />
    default:
      return field.enum?.length ? (
        <Dropdown
          id={id}
          name={field.name}
          items={field.enum.map((value) => ({ value, label: value }))}
          required={field.required}
        />
      ) : field.type === "string" &&
        (!field.maxLength || field.maxLength > 100) ? (
        <Textarea
          id={id}
          name={field.name}
          placeholder={field.name}
          maxLength={field.maxLength}
          required={field.required}
        />
      ) : (
        <Input
          id={id}
          name={field.name}
          type={field.type}
          placeholder={field.name}
          maxLength={field.maxLength}
          required={field.required}
        />
      )
  }
}

export interface IFormPageProps {
  name: string
}

export function FormPage({ name }: IFormPageProps) {
  const metadata = React.useMemo(() => ThunderSDK.getMetadata(name), [name])

  return (
    <form className="mx-auto w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Form</FieldLegend>
          <FieldDescription>
            Fill the form below to create a new {name} entry. All fields are
            required
          </FieldDescription>
          <FieldGroup></FieldGroup>
          {fieldsFromModuleMetadata(metadata).map((field) => {
            const id = crypto.randomUUID()

            return (
              <Field key={field.name}>
                <FieldLabel htmlFor={id} className="capitalize">
                  {field.name}
                </FieldLabel>
                {renderField(id, field)}
                <FieldDescription>{field.description}</FieldDescription>
              </Field>
            )
          })}
        </FieldSet>

        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  )
}
