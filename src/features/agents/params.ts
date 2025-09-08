import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";
import { DEFAULT_PAGE } from "../../../constants";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
const agentsSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};

export const loadAgentsSearchParams = createLoader(agentsSearchParams);
