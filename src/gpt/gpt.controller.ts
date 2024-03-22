import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  OrthograpyDto,
  ProsConsDiscuserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import type { Response } from 'express';

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

  @Post('translate')
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async transformTextToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async getAudio(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.gptService.getAudio(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
}
