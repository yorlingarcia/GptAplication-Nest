import { Injectable } from '@nestjs/common';

import {
  AudioToTextDto,
  ImageGenerateVariationDto,
  ImageGenerationDto,
  OrthograpyDto,
  ProsConsDiscuserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import {
  audioToTextUseCase,
  getAudioUseCase,
  getImageUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthograpyCheckUseCase,
  prosConsDiscuserStreamUseCase,
  prosConsDiscuserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  //Solo va a llmar casos de uso

  async orthograpyCheck(orthograpyDto: OrthograpyDto) {
    return await orthograpyCheckUseCase(this.openai, {
      prompt: orthograpyDto.prompt,
    });
  }

  async prosConsDiscuser({ prompt }: ProsConsDiscuserDto) {
    return await prosConsDiscuserUseCase(this.openai, { prompt });
  }

  async prosConsDiscuserStream({ prompt }: ProsConsDiscuserDto) {
    return await prosConsDiscuserStreamUseCase(this.openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async audioToText(
    audioFile: Express.Multer.File,
    { prompt }: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openai, { prompt, audioFile });
  }

  async getAudio(fileId: string) {
    return await getAudioUseCase({ fileId });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  async getImage(fileName: string) {
    return await getImageUseCase({ fileName });
  }

  generateImageVariation({ baseImage }: ImageGenerateVariationDto) {
    return imageVariationUseCase(this.openai, { baseImage });
  }
}
