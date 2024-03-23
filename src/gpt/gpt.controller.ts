import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerateVariationDto,
  ImageGenerationDto,
  OrthograpyDto,
  ProsConsDiscuserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtenesion = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtenesion}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async transformAudioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1025 * 5,
            message: 'File is bigger than 5Mb',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() aduioTotextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, aduioTotextDto);
  }

  @Get('text-to-audio/:fileId')
  async getAudio(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.gptService.getAudio(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:fileName')
  async getGeneratedImage(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.getImage(fileName);
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-generate-variation')
  async imageGenerateVariation(
    @Body() imageGenerateVariationDto: ImageGenerateVariationDto,
  ) {
    return await this.gptService.generateImageVariation(
      imageGenerateVariationDto,
    );
  }
}
