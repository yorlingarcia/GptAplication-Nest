import OpenAI from 'openai';

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

  console.log(response);

  return {
    url: response.data[0].url,
    localPath: '',
    revised_prompt: response.data[0].revised_prompt,
  };
};
