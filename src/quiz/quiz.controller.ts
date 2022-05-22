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
  ApiNotAcceptableResponse,
  ApiOAuth2,
  ApiOkResponse,
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
  @ApiOperation({
    summary: '비회원용 선택 게임 정보 불러오기',
    description: '선택해서 게임하기의 게임 리스트를 반환합니다.',
  })
  @ApiResponse({
    type: GameDto,
  })
  @Get('/select')
  async getGameSelectionList() {
    return this.quizService.getSelectionList();
  }

  @ApiOperation({
    summary: '회원용 선택 게임 정보 불러오기',
    description: '선택해서 게임하기의 게임 리스트를 반환합니다.',
  })
  @ApiResponse({
    type: GameDto,
  })
  @ApiBearerAuth('access-token')
  @Get('/selectForUser')
  async getGameSelectionListForUser(@Request() req) {
    return this.quizService.getSelectionListForUser(req.user.id);
  }

  @Post('/unlock')
  @ApiOperation({
    summary: '난이도 해금',
    description: '난이도를 별로 해금할때 필요한 API입니다.',
  })
  @ApiBody({
    schema: {
      properties: {
        gameid: { type: 'number', example: 1 },
        difficulty: { type: 'number', example: 2 },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '정상 반응' })
  @ApiNotAcceptableResponse({ description: '별이 부족할 때' })
  async unlockDifficulty(@Request() req, @Body() body) {
    await this.userService.unlockDifficulty(
      req.user.id,
      body.gameid,
      body.difficulty,
    );
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
