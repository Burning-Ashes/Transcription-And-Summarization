'use server';

/**
 * @fileOverview A study material summarization AI agent.
 *
 * - generateStudyMaterialSummary - A function that handles the study material summarization process.
 * - GenerateStudyMaterialSummaryInput - The input type for the generateStudyMaterialSummary function.
 * - GenerateStudyMaterialSummaryOutput - The return type for the generateStudyMaterialSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyMaterialSummaryInputSchema = z.object({
  materialDataUri: z
    .string()
    .describe(
      "A study material document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateStudyMaterialSummaryInput = z.infer<typeof GenerateStudyMaterialSummaryInputSchema>;

const GenerateStudyMaterialSummaryOutputSchema = z.object({
  summary: z.string().describe('The summary of the study material.'),
  progress: z.string().describe('Short summary of what has been generated.'),
});
export type GenerateStudyMaterialSummaryOutput = z.infer<typeof GenerateStudyMaterialSummaryOutputSchema>;

export async function generateStudyMaterialSummary(input: GenerateStudyMaterialSummaryInput): Promise<GenerateStudyMaterialSummaryOutput> {
  return generateStudyMaterialSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyMaterialSummaryPrompt',
  input: {schema: GenerateStudyMaterialSummaryInputSchema},
  output: {schema: GenerateStudyMaterialSummaryOutputSchema},
  prompt: `You are an expert summarizer for study materials.

You will generate a concise summary of the document to help students quickly understand the core content.

Use the following document as the source of information:

Document: {{media url=materialDataUri}}`,
});

const generateStudyMaterialSummaryFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialSummaryFlow',
    inputSchema: GenerateStudyMaterialSummaryInputSchema,
    outputSchema: GenerateStudyMaterialSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a concise summary of the uploaded study material.',
    };
  }
);
