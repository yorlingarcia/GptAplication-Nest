import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthograpyDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthograpy-ckeck')
  orthograpyCheck(@Body() orthograpyDto: OrthograpyDto) {
    return this.gptService.orthograpyCheck(orthograpyDto);
  }
}
