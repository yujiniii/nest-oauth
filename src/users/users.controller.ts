//import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { GithubCodeDto } from './dto/github-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /* github OAUTH */
  @Post('/github-login')
  public async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
    const user = await this.usersService.getGithubInfo(githubCodeDto);

    return {
      status: 200,
      message: '깃허브 유저 정보를 조회하였습니다.',
      data: {
        user,
      },
    };
  }
  @Get('/github-login')
  githubCall() {
    return this.usersService.githubCall();
  }

  /* google OAUTH */
  @Get('google-login')
  @UseGuards(AuthGuard('google'))
  google(@Req() req) {
    console.log('IN');
  }

  @Get('google-login/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req) {
    return this.usersService.google(req);
  }
}

// @Patch(':id')
// update(@Param('id') id: string, @Body() updateUserDto) {
//   return this.usersService.update(+id, updateUserDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.usersService.remove(+id);
// }
