export type Spec = {
  name: string
  value: string
}

export type GearAndSetupItem = {
  name: string
  type: string
  description: string
  specs?: Spec[]
  link?: string 
}

export type GearAndSetupGroup = {
  category: string
  items: GearAndSetupItem[]
}