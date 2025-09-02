// src/ai/flows/extract-and-display-tables.ts
'use server';

/**
 * @fileOverview Extracts tables from files (Excel and PDF) using GenAI.
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
  headers: z.array(z.string()).describe('The headers of the table.'),
  rows: z.array(z.array(z.string())).describe('The rows of the table.'),
});

const ExtractTablesOutputSchema = z.object({
  tables: z.array(TableSchema).describe('The extracted tables from the file.'),
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

Ensure that the "tables" array in the output contains all tables found in the document.

File Type: {{{fileType}}}
File Content: {{media url=fileDataUri}}

Ensure the output is valid JSON format.
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

    if (output && output.tables.length > 0) {
      // Add "Shop Drawing Approval Date" to the Engineering table (first table)
      const engineeringTable = output.tables[0];
      if (engineeringTable) {
        // Add header if it doesn't exist
        if (!engineeringTable.headers.includes('Shop Drawing Approval Date')) {
          const submissionDateIndex = engineeringTable.headers.indexOf('Shop Drawing Submission Date');
          const approvalDateHeader = 'Shop Drawing Approval Date';
          
          if (submissionDateIndex !== -1) {
            // Insert after "Shop Drawing Submission Date"
            engineeringTable.headers.splice(submissionDateIndex + 1, 0, approvalDateHeader);
            engineeringTable.rows.forEach(row => {
              row.splice(submissionDateIndex + 1, 0, '');
            });
          } else {
            // Fallback: add to the end
            engineeringTable.headers.push(approvalDateHeader);
            engineeringTable.rows.forEach(row => {
              row.push('');
            });
          }
        }
      }
    }
    
    return output!;
  }
);
