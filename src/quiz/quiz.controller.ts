import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizEntity } from './entities/quiz.entity';
import { UserDataDto } from 'src/users/dto/user-data-dto';
import { Public } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ResultDto } from './dto/result-dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GameDto } from './dto/game-dto';
import { GameEntity } from './entities/game.entity';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private userService: UsersService,
  ) {}

  @Public()
  @ApiParam({
    name: 'gameid',
    required: true,
    description: 'gameid URL',
  })
  @ApiParam({
    name: 'quizid',
    required: true,
    description: 'quizid URL',
  })
  @ApiOperation({
    summary: 'Quiz 정보 획득',
    description: 'gameid와 quizid를 이용하여 Quiz의 정보를 획득합니다.',
  })
  @ApiResponse({ type: QuizEntity })
  @Get(':gameid/:quizid')
  getQuizInformation(
    @Param('gameid') gameid: number,
    @Param('quizid') quizid: number,
  ) {
    return this.quizService.findQuiz(gameid, quizid);
  }

  @Public()
  @ApiExcludeEndpoint()
  @Post('/select')
  async getGameSelectionList() {
    return this.quizService.getSelectionList();
  }

  @Get('/CIST')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'CIST 정보 획득',
    description: 'CIST 퀴즈들의 배열을 Return합니다',
  })
  @ApiCreatedResponse({
    schema: {
      properties: {
        gameid: { type: 'number', example: 30 },
        gamename: { type: 'string', example: 'CIST1' },
        usingFragment: { type: 'string', example: 'shortAnswer' },
        field: { type: 'string', example: 'CIST' },
        quizid: { type: 'number', example: 6 },
      },
    },
  })
  async getCIST(@Request() req) {
    console.log(req.user);
    return this.quizService.getCIST(req.user.id);
  }

  @Public()
  @ApiOperation({
    summary: '동물 이름 퀴즈 정답체크',
    description: 'MySQL의 동물이름 사전을 이용하여 정답 개수를 확인합니다.',
  })
  @ApiCreatedResponse({ type: Number })
  @ApiBody({
    schema: {
      properties: {
        result: { type: 'string', example: '개,고양이,장난감' },
      },
    },
  })
  @Post('/DICTQuiz')
  async getDICTQuizScore(@Body() req) {
    return this.quizService.getDICTQuizScore(req.result);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'CIST 점수 추가',
    description:
      'MySQL에 있는 유저 정보에 CIST 점수를 추가합니다. 게임ID가 54일 경우(마지막 문제), 결과를 Return합니다',
  })
  @ApiBody({
    schema: {
      properties: {
        gameID: { type: 'string' },
        score: { type: 'string' },
      },
    },
  })
  @Post('/CISTADDResult')
  async addCISTResult(@Body() body: ResultDto, @Request() req) {
    return this.userService.addCISTResult(body.gameID, body.score, req.user.id);
  }

  //@Post('/CISTResult')

  /*
  @Get('/DICT')
  async getDICT() {
    return this.quizService.getDICT();
  }

  @Public()
  @Post('/DICT2')
  async getDICT2(@Req() request) {
    return this.quizService.getDICT2();
  }
  */
}
