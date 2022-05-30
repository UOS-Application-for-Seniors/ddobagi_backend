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
import { Public } from 'src/auth/jwt-auth.guard';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
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

  @Public()
  @Get(':path1/:name/')
  async thumbnailDownload(
    @Res() res: Response,
    @Param('path1') path1: string,
    @Param('name') name: string,
    @Query('fn') fileName,
  ) {
    res.download(`src/common/file/quiz/${path1}/${name}`, fileName);
  }

  @Public()
  @Get(':path1/:path2/:name/')
  async download(
    @Res() res: Response,
    @Param('path1') path1: string,
    @Param('path2') path2: string,
    @Param('name') name: string,
    @Query('fn') fileName,
  ) {
    res.download(`src/common/file/${path1}/${path2}/${name}`, fileName);
  }
}
