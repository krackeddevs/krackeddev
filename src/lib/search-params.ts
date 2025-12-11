import { parseAsInteger, parseAsString } from "nuqs";

export const jobSearchParams = {
  search: parseAsString.withDefault(""),
  location: parseAsString.withDefault(""),
  type: parseAsString.withDefault(""),
  salaryMin: parseAsInteger.withDefault(0),
};
