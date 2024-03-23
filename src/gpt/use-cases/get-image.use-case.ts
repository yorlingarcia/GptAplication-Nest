import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

interface Options {
  fileName: string;
}

export const getImageUseCase = async ({ fileName }: Options) => {
  const folderPath = path.resolve(
    __dirname,
    `../../../generated/images/${fileName}`,
  );

  if (!fs.existsSync(folderPath))
    throw new NotFoundException(
      `La imagen con el nombre "${fileName}" no existe`,
    );

  return folderPath;
};
