import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGnerationUseCase = async (
  openAi: OpenAI,
  { prompt, originalImage, maskImage }: Options,
) => {
  const response = await openAi.images.generate({
    prompt,
    model: 'dall-e-2',
    n: 1,
    size: '1024x1024', //bajar calidad
    quality: 'standard',
    response_format: 'url',
  });

  const url = await downloadImageAsPng(response.data[0].url);

  return {
    url,
    openAiUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
