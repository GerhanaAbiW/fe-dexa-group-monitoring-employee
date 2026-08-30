export type Nullable<T> = T | null

export interface SelectOption<T extends string = string> {
  label: string
  value: T
}
