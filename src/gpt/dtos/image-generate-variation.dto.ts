import { IsString } from 'class-validator';

export class ImageGenerateVariationDto {
  @IsString()
  readonly baseImage: string;
}
