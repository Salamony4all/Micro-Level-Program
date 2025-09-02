// src/types/index.ts

export type Table = {
  title: string;
  headers: string[];
  rows: string[][];
};

export type LocationData = {
  location: string;
  tables: Table[];
};

export type ExtractTablesOutput = {
  locations: LocationData[];
};
