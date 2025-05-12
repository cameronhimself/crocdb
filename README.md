# crocdb

A library and CLI tool for using the [CrocDB API](https://crocdb.net/static/pages/docs/api/index.html).

## Installation

```sh
npm i crocdb
```

Or, to have the `crocdb` CLI command available everywhere, install globally:

```sh
npm i -g crocdb
```

## CLI

Run `crocdb help` to see a list of available commands, and `crocdb help [command]` to see help for individual commands.

You can also view the [CrocDB API](https://crocdb.net/static/pages/docs/api/index.html) documentation for more details and examples.

### Examples

- Get the first 5 results for NES, SNES, or N64 games containing "mario" released in the US region:  

  ```sh
  crocdb search \
    --title-human "%mario%" \
    --platform NES SNES N64 \
    --regions US \
    --limit 5
  ```
  ```txt
  [
    {
      "gameid": 1386,
      "slug": "dr-mario-japan-2-usa-en-rev-1-us-jp-nes-nes",
      "original_name": "Dr. Mario (Japan, USA) (En) (Rev 1)",
      ...
    }
    ...
  ]
  ```
- Get the available platforms from CrocDB:  

  ```sh
  crocdb platforms
  ```
  ```txt
  {
    "NES": "Nintendo",
    "SNES": "Super Nintendo",
    "GB": "GameBoy",
    "GBC": "GameBoy Color",
    ...
  }
  ```

- Get the available regions from CrocDB:  

  ```sh
  crocdb regions
  ```
  ```txt
  {
    "US": "USA",
    "EU": "Europe",
    "JP": "Japan",
    "NS": "Not specified",
    "ANY": "World"
  }
  ```

## API

These are equivalent to the CLI commands above:

```ts
import { api } from "crocdb";

api.search({
  titleHuman: "%mario%",
  platform: ["NES", "SNES", "N64"],
  regions: ["US"],
  limit: 5,
}).then(result => console.log(result));

api.platforms().then(result => console.log(result));
api.regions().then(result => console.log(result));
```
