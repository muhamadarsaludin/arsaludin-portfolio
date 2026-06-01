import { GEAR_AND_SETUP_DATA_EN } from "./gear-and-setup-en"
import { GEAR_AND_SETUP_DATA_ID } from "./gear-and-setup-id"

export function getGearAndSetup(locale: string) {
  if (locale === "id") return GEAR_AND_SETUP_DATA_ID
  return GEAR_AND_SETUP_DATA_EN
}
