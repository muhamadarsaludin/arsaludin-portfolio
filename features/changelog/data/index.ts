import { CHANGELOG_EN } from "./changelog-en";
import { CHANGELOG_ID } from "./changelog-id";

export function getChangelog (locale: string) {
  if (locale === "id") return CHANGELOG_ID
  return CHANGELOG_EN
}