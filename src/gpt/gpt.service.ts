import { Injectable } from '@nestjs/common';

import { OrthograpyDto, ProsConsDiscuserDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import {
  orthograpyCheckUseCase,
  prosConsDiscuserStreamUseCase,
  prosConsDiscuserUseCase,
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
}
