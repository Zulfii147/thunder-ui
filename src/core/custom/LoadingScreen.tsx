import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export interface ILoadingScreenProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function LoadingScreen({
  title,
  description,
  children,
}: ILoadingScreenProps) {
  return (
    <Empty className="h-dvh">
      <EmptyHeader>
        <EmptyMedia variant="icon"></EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {children && (
        <EmptyContent className="flex-row justify-center gap-2">
          {children}
        </EmptyContent>
      )}
      {/* <Button variant="link" className="text-muted-foreground" size="sm">
        <a href="#">Having an issue?</a>
      </Button> */}
    </Empty>
  )
}
