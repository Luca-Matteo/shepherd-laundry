/**
 * Shared reactive stores for Shepherd Laundry.
 * In the real app these would fetch from the Django REST API.
 * For now they hold mock data so every page is interactive.
 */
import { writable, derived } from "svelte/store";

/* -------------------------------------------------- */
/*  Types                                              */
/* -------------------------------------------------- */

export interface LaundryItem {
  id: string;
  name: string;
  fabricType: "cotton" | "synthetic" | "wool" | "delicate" | "linen" | "mixed";
  color: "white" | "light" | "dark" | "color";
  owner: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "clean" | "hamper" | "washing" | "drying";
  lastWashed: string | null;
  hygieneLimit: number; // days before must wash
}

export interface WashCycle {
  id: string;
  name: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "running" | "completed" | "cancelled";
  items: string[]; // item ids
  temperature: number;
  fabricType: string;
  colorGroup: string;
  duration: number; // minutes
  machineLoad: number; // 0-100 percent
}

export interface DryingSession {
  id: string;
  method: "dryer" | "indoor" | "outdoor" | "combo";
  items: string[];
  startedAt: string;
  estimatedEnd: string;
  status: "active" | "completed";
}

export interface Consumable {
  id: string;
  name: string;
  category: "detergent" | "softener" | "bleach" | "stain-remover" | "other";
  currentAmount: number;
  maxAmount: number;
  unit: string;
  depletionRate: number; // units per wash
  lastRefilled: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar: string; // initials
  color: string;
}

/* -------------------------------------------------- */
/*  Mock Data                                          */
/* -------------------------------------------------- */

const MEMBERS: FamilyMember[] = [
  {
    id: "m1",
    name: "Alex",
    email: "alex@home.local",
    role: "admin",
    avatar: "A",
    color: "var(--color-accent)",
  },
  {
    id: "m2",
    name: "Jordan",
    email: "jordan@home.local",
    role: "member",
    avatar: "J",
    color: "var(--color-text-secondary)",
  },
  {
    id: "m3",
    name: "Sam",
    email: "sam@home.local",
    role: "member",
    avatar: "S",
    color: "#7B68EE",
  },
];

const ITEMS: LaundryItem[] = [
  {
    id: "i1",
    name: "Weiße T-Shirts (x5)",
    fabricType: "cotton",
    color: "white",
    owner: "m1",
    priority: "normal",
    status: "hamper",
    lastWashed: "2026-02-20",
    hygieneLimit: 7,
  },
  {
    id: "i2",
    name: "Jeans (x2)",
    fabricType: "cotton",
    color: "dark",
    owner: "m1",
    priority: "low",
    status: "clean",
    lastWashed: "2026-02-22",
    hygieneLimit: 14,
  },
  {
    id: "i3",
    name: "Bettwäsche — Schlafzimmer",
    fabricType: "cotton",
    color: "white",
    owner: "m1",
    priority: "high",
    status: "hamper",
    lastWashed: "2026-02-10",
    hygieneLimit: 7,
  },
  {
    id: "i4",
    name: "Sportkleidung",
    fabricType: "synthetic",
    color: "color",
    owner: "m2",
    priority: "urgent",
    status: "hamper",
    lastWashed: "2026-02-21",
    hygieneLimit: 2,
  },
  {
    id: "i5",
    name: "Wollpullover",
    fabricType: "wool",
    color: "dark",
    owner: "m2",
    priority: "low",
    status: "clean",
    lastWashed: "2026-02-15",
    hygieneLimit: 30,
  },
  {
    id: "i6",
    name: "Kinderuniformen (x3)",
    fabricType: "mixed",
    color: "color",
    owner: "m3",
    priority: "high",
    status: "washing",
    lastWashed: null,
    hygieneLimit: 3,
  },
  {
    id: "i7",
    name: "Handtücher — Bad",
    fabricType: "cotton",
    color: "light",
    owner: "m1",
    priority: "normal",
    status: "drying",
    lastWashed: "2026-02-24",
    hygieneLimit: 5,
  },
  {
    id: "i8",
    name: "Seidenbluse",
    fabricType: "delicate",
    color: "light",
    owner: "m2",
    priority: "normal",
    status: "clean",
    lastWashed: "2026-02-18",
    hygieneLimit: 14,
  },
  {
    id: "i9",
    name: "Kapuzenpullover",
    fabricType: "cotton",
    color: "dark",
    owner: "m3",
    priority: "normal",
    status: "hamper",
    lastWashed: "2026-02-19",
    hygieneLimit: 7,
  },
  {
    id: "i10",
    name: "Leinen-Tischdecke",
    fabricType: "linen",
    color: "white",
    owner: "m1",
    priority: "low",
    status: "clean",
    lastWashed: "2026-02-12",
    hygieneLimit: 21,
  },
];

const CYCLES: WashCycle[] = [
  {
    id: "c1",
    name: "Weißwäsche — 60°C",
    scheduledDate: "2026-02-24",
    scheduledTime: "08:00",
    status: "completed",
    items: ["i1", "i3"],
    temperature: 60,
    fabricType: "cotton",
    colorGroup: "white",
    duration: 90,
    machineLoad: 75,
  },
  {
    id: "c2",
    name: "Buntwäsche — 40°C",
    scheduledDate: "2026-02-24",
    scheduledTime: "10:00",
    status: "running",
    items: ["i6"],
    temperature: 40,
    fabricType: "mixed",
    colorGroup: "color",
    duration: 60,
    machineLoad: 45,
  },
  {
    id: "c3",
    name: "Sportwäsche — 30°C",
    scheduledDate: "2026-02-25",
    scheduledTime: "07:30",
    status: "scheduled",
    items: ["i4"],
    temperature: 30,
    fabricType: "synthetic",
    colorGroup: "color",
    duration: 45,
    machineLoad: 30,
  },
  {
    id: "c4",
    name: "Dunkle Wäsche — 40°C",
    scheduledDate: "2026-02-25",
    scheduledTime: "09:30",
    status: "scheduled",
    items: ["i9"],
    temperature: 40,
    fabricType: "cotton",
    colorGroup: "dark",
    duration: 75,
    machineLoad: 50,
  },
  {
    id: "c5",
    name: "Weißwäsche — 60°C",
    scheduledDate: "2026-02-26",
    scheduledTime: "08:00",
    status: "scheduled",
    items: ["i1"],
    temperature: 60,
    fabricType: "cotton",
    colorGroup: "white",
    duration: 90,
    machineLoad: 40,
  },
];

const DRYING: DryingSession[] = [
  {
    id: "d1",
    method: "indoor",
    items: ["i7"],
    startedAt: "2026-02-24T09:30",
    estimatedEnd: "2026-02-24T21:00",
    status: "active",
  },
  {
    id: "d2",
    method: "dryer",
    items: ["i1", "i3"],
    startedAt: "2026-02-24T10:00",
    estimatedEnd: "2026-02-24T11:30",
    status: "active",
  },
];

const CONSUMABLES: Consumable[] = [
  {
    id: "s1",
    name: "Öko-Waschmittel",
    category: "detergent",
    currentAmount: 1200,
    maxAmount: 3000,
    unit: "ml",
    depletionRate: 60,
    lastRefilled: "2026-02-01",
  },
  {
    id: "s2",
    name: "Weichspüler",
    category: "softener",
    currentAmount: 800,
    maxAmount: 2000,
    unit: "ml",
    depletionRate: 40,
    lastRefilled: "2026-02-05",
  },
  {
    id: "s3",
    name: "Sauerstoffbleiche",
    category: "bleach",
    currentAmount: 150,
    maxAmount: 500,
    unit: "g",
    depletionRate: 30,
    lastRefilled: "2026-01-28",
  },
  {
    id: "s4",
    name: "Fleckenentferner-Spray",
    category: "stain-remover",
    currentAmount: 90,
    maxAmount: 400,
    unit: "ml",
    depletionRate: 15,
    lastRefilled: "2026-02-10",
  },
];

/* -------------------------------------------------- */
/*  Stores                                             */
/* -------------------------------------------------- */

export const members = writable<FamilyMember[]>(MEMBERS);
export const items = writable<LaundryItem[]>(ITEMS);
export const cycles = writable<WashCycle[]>(CYCLES);
export const dryingSessions = writable<DryingSession[]>(DRYING);
export const consumables = writable<Consumable[]>(CONSUMABLES);

/* -------------------------------------------------- */
/*  Derived                                            */
/* -------------------------------------------------- */

export const hamperItems = derived(items, ($items) =>
  $items.filter((i) => i.status === "hamper"),
);

export const activeCycles = derived(cycles, ($cycles) =>
  $cycles.filter((c) => c.status === "running" || c.status === "scheduled"),
);

export const lowConsumables = derived(consumables, ($cons) =>
  $cons.filter((c) => c.currentAmount / c.maxAmount < 0.3),
);

export const urgentItems = derived(items, ($items) =>
  $items.filter((i) => i.priority === "urgent" || i.priority === "high"),
);
