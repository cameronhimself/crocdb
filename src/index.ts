import { CROCDB_API_BASE_URL, PLATFORM_CODES, REGION_CODES } from "./constants";

export namespace CrocDB {
  export type PlatformCode = typeof PLATFORM_CODES[number];
  export type RegionCode = typeof REGION_CODES[number];

  export type Link = {
    name: string;
    value: string;
    source: string;
    ext: string;
    host: string;
  };

  export type ROM = {
    gameid: number;
    slug: string;
    original_name: string;  
    title: string;
    title_human: string;
    platform: PlatformCode;
    regions: Array<RegionCode>;
    format: string;
    size: number;
    size_human: string;
    links: Array<Link>;
  };

  export type SearchRequest = Partial<Omit<ROM, "links" | "platform"> & {
    platform: Array<PlatformCode>;
    limit: number;
    page: number;
  }>;

  export type SearchResponse = Array<ROM>;
  export type RegionsResponse = Record<RegionCode, string>;
  export type PlatformsResponse = Record<PlatformCode, string>;

  export class RequestError extends Error {
    static async fromResponse<TRequestData extends object>(response: Response, requestData?: TRequestData): Promise<RequestError> {
      const err = new RequestError();
      const messageLines = [];
      messageLines.push(...[
        `Error querying ${response.url}`,
        `Status: ${response.status} ${response.statusText}`,
        `Request Data: ${JSON.stringify(requestData, undefined, 2)}`,
        `Reponse body: ${await response.text()}`,
      ]);
      err.message = messageLines.join("\n");
      return err;
    }
  }
};

export const api = {
  search: async (request: CrocDB.SearchRequest): Promise<CrocDB.SearchResponse> => {
    const doFetch = async (page?: number): Promise<CrocDB.SearchResponse> => {
      const params = new URLSearchParams();
      for (const key in request) {
        const value = request[key as keyof CrocDB.SearchRequest];
        params.set(key, typeof value === "string" ? value : JSON.stringify(value));
      }
      if (page !== undefined) {
        params.set("page", JSON.stringify(page));
      }
      const response = await fetch(`${CROCDB_API_BASE_URL}/search?${params}`);
      if (!response.ok) {
        throw await CrocDB.RequestError.fromResponse(response, params);
      }
      const rawResponse = await response.json();
      return rawResponse.map((rom: Record<string, any>) => ({
        gameid: rom.gameid,
        slug: rom.slug,
        original_name: rom.original_name,
        title: rom.title,
        title_human: rom.title_human,
        platform: rom.platform,
        regions: rom.regions,
        format: rom.format,
        size: rom.size,
        size_human: rom.size_human,
        links: rom.links,
      } satisfies CrocDB.ROM));
    };

    const limit = request.limit === undefined ? 1 : request.limit;
    if (limit > 50 || limit <= 0) {
      let page = 1;
      let partialResult = await doFetch(page);
      const result: typeof partialResult = [];
    
      while(partialResult.length) {
        page++;
        result.push(...partialResult);
        if (limit > 50 && result.length >= limit) {
          result.length = limit;
          break;
        }
        partialResult = await doFetch(page);
      }
      return result;
    }
    return await doFetch();
  },
  platforms: async (): Promise<CrocDB.PlatformsResponse> => {
    const response = await fetch(`${CROCDB_API_BASE_URL}/platforms`);
    if (!response.ok) {
      throw await CrocDB.RequestError.fromResponse(response);
    }
    return await response.json();
  },
  regions: async (): Promise<CrocDB.RegionsResponse> => {
    const response = await fetch(`${CROCDB_API_BASE_URL}/regions`);
    if (!response.ok) {
      throw await CrocDB.RequestError.fromResponse(response);
    }
    return await response.json();
  }
};
