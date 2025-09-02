// src/ai/flows/extract-and-display-tables.ts
'use server';

/**
 * @fileOverview Extracts tables from files (Excel and PDF) using GenAI, grouped by location.
 *
 * - extractTables - Extracts tables from a given file.
 * - ExtractTablesInput - The input type for the extractTables function.
 * - ExtractTablesOutput - The return type for the extractTables function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTablesInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      'The file (Excel or PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  fileType: z.enum(['excel', 'pdf']).describe('The type of the uploaded file.'),
});
export type ExtractTablesInput = z.infer<typeof ExtractTablesInputSchema>;

const TableSchema = z.object({
  title: z.string().describe('The title of the table (e.g., "Engineering", "Procurement", "Execution").'),
  headers: z.array(z.string()).describe('The headers of the table.'),
  rows: z.array(z.array(z.string())).describe('The rows of the table.'),
});

const LocationDataSchema = z.object({
  location: z.string().describe('The name of the location, area, or zone.'),
  tables: z.array(TableSchema).describe('The tables associated with this location (Engineering, Procurement, Execution).'),
});

const ExtractTablesOutputSchema = z.object({
    locations: z.array(LocationDataSchema).describe('An array of locations, each with its own set of tables.'),
});
export type ExtractTablesOutput = z.infer<typeof ExtractTablesOutputSchema>;

export async function extractTables(input: ExtractTablesInput): Promise<ExtractTablesOutput> {
  return extractTablesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTablesPrompt',
  input: {schema: ExtractTablesInputSchema},
  output: {schema: ExtractTablesOutputSchema},
  prompt: `You are an expert data extraction specialist.

You will receive a file (in data URI format) and your task is to extract all tables from it. The file can be either an Excel file or a PDF file.

First, identify the "Location/Area/Zone". Then, for each location, extract the "Engineering", "Procurement", and "Execution" tables associated with it.

Structure the output with a list of locations, and under each location, include the three tables.
Ensure the output is valid JSON format.

File Type: {{{fileType}}}
File Content: {{media url=fileDataUri}}
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const extractTablesFlow = ai.defineFlow(
  {
    name: 'extractTablesFlow',
    inputSchema: ExtractTablesInputSchema,
    outputSchema: ExtractTablesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (output && output.locations) {
        output.locations.forEach(location => {
            const engineeringTable = location.tables.find(t => t.title.toLowerCase() === 'engineering');
            if (engineeringTable) {
                if (!engineeringTable.headers.includes('Shop Drawing Approval Date')) {
                    const submissionDateIndex = engineeringTable.headers.indexOf('Shop Drawing Submission Date');
                    const approvalDateHeader = 'Shop Drawing Approval Date';
                    
                    if (submissionDateIndex !== -1) {
                        engineeringTable.headers.splice(submissionDateIndex + 1, 0, approvalDateHeader);
                        engineeringTable.rows.forEach(row => {
                            row.splice(submissionDateIndex + 1, 0, '');
                        });
                    } else {
                        engineeringTable.headers.push(approvalDateHeader);
                        engineeringTable.rows.forEach(row => {
                            row.push('');
                        });
                    }
                }
            }
        });
    }
    
    return output!;
  }
);
