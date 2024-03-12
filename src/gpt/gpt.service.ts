import { Injectable } from '@nestjs/common';
import { orthograpyCheckUseCase } from './use-cases/orthograpy.use-case';
import { OrthograpyDto } from './dtos';
import OpenAI from 'openai';

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
}
