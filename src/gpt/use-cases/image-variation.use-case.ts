import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';

interface Options {
  baseImage: string;
}
export const imageVariationUseCase = async (
  openAi: OpenAI,
  { baseImage }: Options,
) => {
  const pngImagePath = await downloadImageAsPng(baseImage, true);

  const response = await openAi.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAiUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
