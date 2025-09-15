import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-uploaded-lectures.ts';
import '@/ai/flows/generate-study-material-summaries.ts';
import '@/ai/flows/summarize-uploaded-lectures.ts';