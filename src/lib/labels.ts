/**
 * German display labels for all enum values used across the app.
 * Centralised here so every component renders consistent, human-readable text.
 */

export const statusLabels: Record<string, string> = {
  scheduled: "Geplant",
  running: "Läuft",
  completed: "Fertig",
  cancelled: "Abgebrochen",
  clean: "Sauber",
  hamper: "Im Korb",
  washing: "Wäscht",
  drying: "Trocknet",
  active: "Aktiv",
};

export const priorityLabels: Record<string, string> = {
  urgent: "Dringend",
  high: "Hoch",
  normal: "Normal",
  low: "Niedrig",
};

export const fabricLabels: Record<string, string> = {
  cotton: "Baumwolle",
  synthetic: "Synthetik",
  wool: "Wolle",
  delicate: "Feinwäsche",
  linen: "Leinen",
  mixed: "Mischgewebe",
};

export const colorLabels: Record<string, string> = {
  white: "Weiß",
  light: "Hell",
  dark: "Dunkel",
  color: "Bunt",
};

export const categoryLabels: Record<string, string> = {
  detergent: "Waschmittel",
  softener: "Weichspüler",
  bleach: "Bleiche",
  "stain-remover": "Fleckenentf.",
  other: "Sonstiges",
};

export const roleLabels: Record<string, string> = {
  admin: "Admin",
  member: "Mitglied",
};

/** Safe lookup with fallback to key */
export function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
