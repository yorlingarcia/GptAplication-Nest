import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';
import * as fs from 'fs';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openAi: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  if (!originalImage || !maskImage) {
    const response = await openAi.images.generate({
      prompt,
      model: 'dall-e-2',
      n: 1,
      size: '1024x1024', //bajar calidad
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url,
      openAiUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openAi.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  // const localImagePath = await downloadImageAsPng(response.data[0].url);
  const fileName = await downloadImageAsPng(response.data[0].url);

  // const fileName = path.basename(localImagePath);
  // const publicUrl = `http://localhost:3000/${fileName}`;
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
  return {
    url,
    openAiUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
