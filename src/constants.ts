export const CROCDB_API_BASE_URL = "https://crocdb.net/api";
export const CROCDB_API_SEARCH_URL = `${CROCDB_API_BASE_URL}/search`;
export const CROCDB_API_PLATFORMS_URL = `${CROCDB_API_BASE_URL}/platforms`;
export const CROCDB_API_REGIONS_URL = `${CROCDB_API_BASE_URL}/regions`;

export const PLATFORM_CODES = [
  "32X", "3DO", "3DS", "A26", "A52", "A78", "CDI", "CV", "DC", "DSIW",
  "FDS", "FMT", "GB", "GBA", "GBC", "GC", "GG", "INTV", "JAG", "JCD",
  "LYNX", "MAME", "MIN", "N64", "NDD", "NDS", "NES", "NGCD", "PC98",
  "PCFX", "PIP", "PS1", "PS2", "PS3", "PSP", "PSV", "SAT", "SCD", "SMD",
  "SMS", "SNES", "TG16", "TGCD", "VB", "WII", "WIIU", "X360", "XBOX",
] as const;

export const REGION_CODES = [
  "US", "EU", "JP", "NS", "ANY"
] as const;
