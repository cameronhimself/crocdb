#!/usr/bin/env node
import { Command as BaseCommand } from "commander";
import { version } from "../package.json";
import { PLATFORM_CODES, REGION_CODES } from "./constants";
import { api } from "./index";

const formatResult = (obj: object) => JSON.stringify(obj, undefined, 2);

const stripUndefined = (obj: Record<string, any>) => {
  const newObj = { ...obj };
  for (const k in newObj) {
    if (newObj[k] === undefined) {
      delete newObj[k];
    }
  }
  return newObj;
};

const msg = (...strings: Array<string | Array<string>>) => {
  const lines = strings.map(s => Array.isArray(s) ? s.join(" ") : s);
  return lines.join("\n");
};

class Command extends BaseCommand {
  constructor(name?: string) {
    super(name);
    this.configureHelp({ helpWidth: 80 });
  }
}

const program = new Command();
const NAME = "crocdb";

program
  .name(NAME)
  .description('A CLI for querying CrocDB.')
  .version(version)

program.addCommand(new Command("search")
  .description(msg(
    ["Fetch a list of ROMs from CrocDB based on search parameters.",
    "Results are returned as a JSON array. For details and examples,",
    "see the CrocDB API documentation:"],
    "",
    "https://crocdb.net/static/pages/docs/api/index.html",
  ))
  .option("--game-id <id>", "The game ID to search for.")
  .option("--slug <slug>", "The slug to search for.")
  .option("--original-name <name>", "The original name to search for.")
  .option("--title <title>", "The title to search for.")
  .option("--title-human <title>", "The human-readable title to search for.")
  .option("--platform <platform...>",
    `Space-separated list of platforms codes to search for. Valid platform codes are: ${PLATFORM_CODES.join(", ")}`)
  .option("--regions <region...>",
    `Space-separated list of region codes to search for. Valid region codes are: ${REGION_CODES.join(", ")}`)
  .option("--format <format>", "Format of the ROM to search for.")
  .option("--size <size>", "Size of the ROM to search for. Not commonly used for search.")
  .option("--size-human <size>", "Human-readable size of the ROM to search for. Not commonly used for search.")
  .option("--limit <n>", msg(
    "Limit the number of results to return. Default is 1. Zero or negative values disable the limit.",
    "",
    ["The CrocDB API has a max limit of 50, so if you pass a value greater than",
    "that (or disable the limit), multiple API calls will be made and aggregated",
    "into a single result. Disabling the limit should be done with caution as",
    "it can result in very lengthy requests when combined with a generic search query."]
  ))
  .option("--page <n>", msg([
    "Page number to get if the number of results is greater than --limit.",
    "Ignored if the limit is disabled or greater than 50."
  ]))
  .action(async (opts) => {
    const query = stripUndefined({
      gameid: opts.gameId,
      slug: opts.slug,
      original_name: opts.originalName,
      title: opts.title,
      title_human: opts.titleHuman,
      platform: opts.platform,
      regions: opts.regions,
      format: opts.format,
      size: opts.size,
      size_human: opts.sizeHuman,
      limit: opts.limit,
      page: opts.page,
    });
    if (!Object.keys(query).length) {
      console.log(`No search parameters provided. Run '${NAME} search --help' to see available options.`);
      return;
    }
    try {
      const result = await api.search(query);
      console.log(formatResult(result));
    } catch (err: unknown) {
      console.error((err as Error).message);
    }
  })
);

program.addCommand(new Command("platforms")
  .description("Fetch a list of all platforms. Results are returned as a JSON array.")
  .action(async () => {
    let result: Awaited<ReturnType<typeof api.platforms>>;
    try {
      result = await api.platforms();
      console.log(formatResult(result));
    } catch (err) {
      console.error((err as Error).message);
    }
  })
);

program.addCommand(new Command("regions")
  .description("Fetch a list of all regions. Results are returned as a JSON array.")
  .action(async () => {
    let result: Awaited<ReturnType<typeof api.regions>>;
    try {
      result = await api.regions();
      console.log(formatResult(result));
    } catch (err) {
      console.error((err as Error).message);
    }
  })
);

program.parseAsync();
