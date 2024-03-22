import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

interface Options {
  fileId: string;
}

export const getAudioUseCase = async ({ fileId }: Options) => {
  const folderPath = path.resolve(
    __dirname,
    `../../../generated/audios/${fileId}.mp3`,
  );
  if (!fs.existsSync(folderPath))
    throw new NotFoundException(`El audio con id "${fileId}" no existe`);

  return folderPath;
};
