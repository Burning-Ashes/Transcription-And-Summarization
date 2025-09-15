'use server';

/**
 * @fileOverview A lecture transcription AI agent.
 *
 * - transcribeLecture - A function that handles the lecture transcription process.
 * - TranscribeLectureInput - The input type for the transcribeLecture function.
 * - TranscribeLectureOutput - The return type for the transcribeLecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeLectureInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "An audio lecture file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeLectureInput = z.infer<typeof TranscribeLectureInputSchema>;

const TranscribeLectureOutputSchema = z.object({
  transcription: z.string().describe('The transcription of the lecture audio.'),
});
export type TranscribeLectureOutput = z.infer<typeof TranscribeLectureOutputSchema>;

export async function transcribeLecture(input: TranscribeLectureInput): Promise<TranscribeLectureOutput> {
  return transcribeLectureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeLecturePrompt',
  input: {schema: TranscribeLectureInputSchema},
  output: {schema: TranscribeLectureOutputSchema},
  prompt: `You are an expert transcriptionist specializing in educational lectures.\n
You will use this information to transcribe the lecture audio into text. Ensure the transcription is accurate and captures the key points of the lecture.\n
Transcribe the following audio lecture:\n{{media url=audioDataUri}}`,
});

const transcribeLectureFlow = ai.defineFlow(
  {
    name: 'transcribeLectureFlow',
    inputSchema: TranscribeLectureInputSchema,
    outputSchema: TranscribeLectureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
