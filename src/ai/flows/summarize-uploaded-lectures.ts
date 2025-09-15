'use server';

/**
 * @fileOverview A flow to summarize uploaded lecture videos using AI.
 *
 * - summarizeLecture - A function that handles the lecture summarization process.
 * - SummarizeLectureInput - The input type for the summarizeLecture function.
 * - SummarizeLectureOutput - The return type for the summarizeLecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLectureInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A lecture video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeLectureInput = z.infer<typeof SummarizeLectureInputSchema>;

const SummarizeLectureOutputSchema = z.object({
  summary: z.string().describe('A summary of the lecture video.'),
});
export type SummarizeLectureOutput = z.infer<typeof SummarizeLectureOutputSchema>;

export async function summarizeLecture(input: SummarizeLectureInput): Promise<SummarizeLectureOutput> {
  return summarizeLectureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLecturePrompt',
  input: {schema: SummarizeLectureInputSchema},
  output: {schema: SummarizeLectureOutputSchema},
  prompt: `You are an expert educator who creates summaries of long lectures.

  Please provide a summary of the lecture provided in the video.

  Video: {{media url=videoDataUri}}`,
});

const summarizeLectureFlow = ai.defineFlow(
  {
    name: 'summarizeLectureFlow',
    inputSchema: SummarizeLectureInputSchema,
    outputSchema: SummarizeLectureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
