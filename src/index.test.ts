import "mocha";
import { assert } from "chai";
import fetchMock from "fetch-mock";
import {
  CROCDB_API_PLATFORMS_URL,
  CROCDB_API_REGIONS_URL,
  CROCDB_API_SEARCH_URL,
} from "./constants";
import { api, CrocDB } from "./index";

const platformsMock: CrocDB.PlatformsResponse = {
  NES: "Nintendo Entertainment System", FDS: "Famicom Disk System",
  SNES: "Super Nintendo", GB: "Game Boy", GBC: "Game Boy Color",
  GBA: "Game Boy Advance", MIN: "Pokémon Mini", VB: "Virtual Boy",
  N64: "Nintendo 64", NDD: "Nintendo 64DD", GC: "GameCube", NDS: "DS",
  DSIW: "DSiWare", WII: "Wii", "3DS": "3DS", WIIU: "Wii U",
  PS1: "PlayStation 1", PS2: "PlayStation 2", PSP: "PlayStation Portable",
  PS3: "PlayStation 3", PSV: "PlayStation Vita", XBOX: "Xbox",
  X360: "Xbox 360", SMS: "Sega Master System", GG: "Game Gear",
  SMD: "Sega Genesis / Mega Drive", SCD: "Sega CD", "32X": "Sega 32X",
  SAT: "Sega Saturn", DC: "Dreamcast", MAME: "Arcade (MAME)",
  A26: "Atari 2600", A52: "Atari 5200", A78: "Atari 7800",
  LYNX: "Atari Lynx", JAG: "Atari Jaguar", JCD: "Atari Jaguar CD",
  TG16: "TurboGrafx-16", TGCD: "TurboGrafx-CD", PCFX: "PC-FX",
  PC98: "PC-98", INTV: "Intellivision", CV: "ColecoVision", "3DO": "3DO",
  CDI: "Philips CD-i", FMT: "FM Towns", NGCD: "Neo Geo CD",
  PIP: "Bandai Pippin",
};

const regionsMock: CrocDB.RegionsResponse = {
  US: "USA", EU: "Europe", JP:"Japan", NS: "Not specified", ANY:"World",
};

const searchMock: CrocDB.SearchResponse = [{
  "gameid": 32191,
  "slug": "metroid-other-m-europe-en-2-fr-2-de-2-es-2-it-rev-1-eu-wii-rvz",
  "original_name": "Metroid - Other M (Europe) (En,Fr,De,Es,It) (Rev 1)",
  "title": "Metroid - Other M (En,Fr,De,Es,It) (Rev 1)",
  "title_human": "metroid other m en fr de es it rev 1",
  "platform": "WII",
  "regions": ["EU"],
  "format": "RVZ",
  "size": 6335076761,
  "size_human": "5.9G",
  "links": [{
    "name": "main",
    "value": "http://example.com/file.zip",
    "ext": ".zip",
    "host": "example.com",
    "source": "example"
  }],
}];

describe("crocdb", () => {
  afterEach(() => {
    fetchMock.unmockGlobal();
  });
  it("searches", async () => {
    fetchMock.mockGlobal().route(
      new RegExp(`^${CROCDB_API_SEARCH_URL}.*`),
      searchMock satisfies CrocDB.SearchResponse,
    );
    const response = await api.search({ title_human: "%metriod%" });
    assert.deepStrictEqual(response, searchMock);
  });
  it("fetches platforms", async () => {
    fetchMock.mockGlobal().route(
      CROCDB_API_PLATFORMS_URL,
      platformsMock satisfies CrocDB.PlatformsResponse,
    );
    const response = await api.platforms();
    assert.deepStrictEqual(response, platformsMock);
  });
  it("fetches regions", async () => {
    fetchMock.mockGlobal().route(
      CROCDB_API_REGIONS_URL,
      regionsMock satisfies CrocDB.RegionsResponse,
    );
    const response = await api.platforms();
    assert.deepStrictEqual(response, platformsMock);
  });
});
