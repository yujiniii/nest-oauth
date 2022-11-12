import { BadRequestException, Injectable } from '@nestjs/common';
import { GithubCodeDto } from './dto/github-user.dto';
import { HttpService } from '@nestjs/axios';

export interface IGithubUserTypes {
  githubId: string;
  avatar: string;
  name: string;
  description: string;
  location: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  // github-oauth
  // https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${URL}`
  async getGithubInfo(githubCodeDto: GithubCodeDto) {
    console.log(githubCodeDto);
    const { code } = githubCodeDto; // 웹에서 query string으로 받은 code를 서버로 넘겨 받습니다.
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';

    const request = {
      code,
      client_id: process.env.OAUTH_GITHUB_ID,
      client_secret: process.env.OAUTH_GITHUB_SECRET,
    };
    const response = await this.httpService
      .post(getTokenUrl, request)
      .toPromise();

    if (response.data.includes('error')) {
      console.log('ERROR : ', response.data);
      throw new BadRequestException(401, '깃허브 인증을 실패했습니다.');
    } else {
      console.log('NO ERROR : ', response.data);
    }

    const arrToken = response.data.split('=');
    const access_token = arrToken[1].substring(0, arrToken[1].indexOf('&'));

    console.log('access_token : ', access_token);
    const headersRequest = {
      Authorization: `token  ${access_token}`,
    };
    const getUserUrl: string = 'https://api.github.com/user';

    const { data } = await this.httpService
      .get(getUserUrl, { headers: headersRequest })
      .toPromise();

    console.log('data : ', data);
    const { login, avatar_url, name, bio, company } = data;

    const githubInfo: IGithubUserTypes = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
    };

    return githubInfo;
  }

  async githubCall() {
    // const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${URL}`;
    // const re = await this.httpService.get(url).toPromise();
    // console.log(re);
    return `HELLO!!`;
  }

  google(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  googleAuthCallback() {
    return `This action updates user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
