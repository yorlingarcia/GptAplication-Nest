import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthograpyDto, ProsConsDiscuserDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthograpy-ckeck')
  orthograpyCheck(@Body() orthograpyDto: OrthograpyDto) {
    return this.gptService.orthograpyCheck(orthograpyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscuser(@Body() prosConsDiscuser: ProsConsDiscuserDto) {
    return this.gptService.prosConsDiscuser(prosConsDiscuser);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDiscuserStream(
    @Body() prosConsDiscuser: ProsConsDiscuserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscuserStream(
      prosConsDiscuser,
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }
    res.end();
  }
}
