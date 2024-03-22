import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  audioFile: Express.Multer.File;
  prompt?: string;
}

export const audioToTextUseCase = async (
  openai: OpenAI,
  { prompt, audioFile }: Options,
) => {
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt,
    language: 'es',
    // response_format: 'vtt',
    response_format: 'verbose_json',
  });
  return response;
};
