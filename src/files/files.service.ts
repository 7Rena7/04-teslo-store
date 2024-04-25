import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProductImage(filename: string) {
    const path = join(__dirname, `../../static/products/${filename}`);

    if (!existsSync(path))
      throw new BadRequestException(`${filename} file not found`);

    return path;
  }
}
