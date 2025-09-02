'use server';

import { extractTables as extractTablesFlow, type ExtractTablesInput, type ExtractTablesOutput } from "@/ai/flows/extract-and-display-tables";

type ActionResult = 
  | { success: true; data: ExtractTablesOutput }
  | { success: false; error: string };

export async function extractTables(input: ExtractTablesInput): Promise<ActionResult> {
  try {
    const result = await extractTablesFlow(input);
    if (!result || !result.locations) {
        return { success: true, data: { locations: [] } };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error extracting tables:", error);
    // It's better to return a generic error message to the client
    return { success: false, error: "Failed to extract tables from the file. Please check the file format and try again." };
  }
}
