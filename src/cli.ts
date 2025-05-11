import { Command } from "commander";
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

const program = new Command();

const NAME = "crocdb";

program
  .name(NAME)
  .description('A CLI for querying CrocDB.')
  .version(version)

program.addCommand(new Command("search")
  .description("Fetch a list of ROMs from CrocDB based on search parameters.")
  .option("--game-id <id>", "The game ID to search for.")
  .option("--slug <slug>", "The slug to search for.")
  .option("--original-name <name>", "The original name to search for.")
  .option("--title <title>", "The title to search for.")
  .option("--title-human <title>", "The human-readable title to search for.")
  .option("--platform <platform...>", `Comma-separated list of platforms codes to search for. Valid platform codes are: ${PLATFORM_CODES.join(", ")}`)
  .option("--regions <region...>", `Comma-separated list of region codes to search for. Valid region codes are: ${REGION_CODES.join(", ")}`)
  .option("--format <format>", "Format of the ROM to search for.")
  .option("--size <size>", "Size of the ROM to search for.")
  .option("--size-human <size>", "Human-readable size of the ROM to search for.")
  .option("--limit <n>", "Limit the number of results to return.")
  .option("--page <n>", "Page number to return.")
  .action(async (opts) => {
    const query = stripUndefined({
      gameid: opts.gameId,
      slug: opts.slug,
      original_name: opts.originalName,
      title: opts.title,
      title_human: opts.titleHuman,
      platform: opts.platform,
      regions: opts.region,
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
    } catch (err) {
      console.error(`Error querying CrocDB: ${(err as Error).message}`);
    }
  })
);

program.addCommand(new Command("platforms")
  .description("Fetch a list of all platforms.")
  .action(async () => {
    let result: Awaited<ReturnType<typeof api.platforms>>;
    try {
      result = await api.platforms();
      console.log(formatResult(result));
    } catch (err) {
      console.error(`Error querying CrocDB: ${(err as Error).message}`);
    }
  })
);

program.addCommand(new Command("regions")
  .description("Fetch a list of all regions.")
  .action(async () => {
    let result: Awaited<ReturnType<typeof api.regions>>;
    try {
      result = await api.regions();
      console.log(formatResult(result));
    } catch (err) {
      console.error(`Error querying CrocDB: ${(err as Error).message}`);
    }
  })
);

program.parseAsync();
