import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
  constructor(private config: ConfigService) {}

  // 파일 다운로드
  // http://localhost:3000/file/[savedPath]?fn=[fileName]
  // http://localhost:3000/file/202104/12312541515151.xlsx?fn=다운받을원본파일명.xlsx
  @Get()
  hello() {
    return 'hello';
  }

  @Get(':path/:name/')
  async download(
    @Res() res: Response,
    @Param('path') path: string,
    @Param('name') name: string,
    @Query('fn') fileName,
  ) {
    res.download(`src/common/file/${path}/${name}`, fileName);
  }
}
