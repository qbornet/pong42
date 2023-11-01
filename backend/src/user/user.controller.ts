import {
  Controller,
  UseGuards,
  UsePipes,
  Logger,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Param,
  Body,
  Put,
  Req,
  Res
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/database/service/users.service';
import * as bcrypt from 'bcrypt';
import { CONST_SALT } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';
import { RemoveService } from './service/remove.service';
import {
  ProfileValidationPipe,
  updateProfileSchema
} from './pipe/profile-validation.pipe';

type UpdateProfileDto = {
  username: string;
  password: string;
};

type UserDto = {
  id: string;
  img: string;
  email: string;
  username: string;
  password: string;
  twoAuthOn: boolean;
  twoAuthSecret: string | null;
  apiToken: string | null;
  connectedChat: boolean;
  friendList: string[];
  blockList: string[];
};

@Controller('user')
@UseGuards(ApiGuard, JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(
    private readonly usersService: UsersService,
    private readonly removeService: RemoveService,
    private readonly authService: AuthService
  ) {}

  @Post('jwt')
  async getUserWithJwt(@Body('jwt') jwt: string) {
    const result = await this.authService.findUserByJWT(jwt);

    if (result) {
      return this.removeService.removeSensitiveData(result);
    }
    return null;
  }

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.removeService.removeSensitiveData({ username });
  }

  @Get('game-stats/:username')
  async getGameState(@Param('username') username: string) {
    const user = await this.usersService.getUserWithMatchHistory(username);
    if (user) {
      const { matchWinned, matchLost } = user;
      return { nbWin: matchWinned.length, nbLoose: matchLost.length };
    }
    return [];
  }

  @Get('match-history/:username')
  async getMatchHistory(@Param('username') username: string) {
    const user = await this.usersService.getUserWithMatchHistory(username);
    if (user) {
      const { matchWinned, matchLost } = user;
      const allMatch = [...matchWinned, ...matchLost];
      const matchSortedByDate = allMatch.sort(
        (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()
      );
      const formattedMatch = matchSortedByDate.map((m) => ({
        id: m.id,
        playerWin: m.playerWin.username,
        playerLoose: m.playerLoose.username,
        winnerScore: m.winnerScore,
        looserScore: m.looserScore,
        timestamp: m.timestamp,
        mode: m.mode
      }));
      return formattedMatch;
    }
    return [];
  }

  @Post('check')
  async checkProfile(@Body('username') username: string) {
    const user = await this.usersService.getUser({ username });
    return user === null;
  }

  @Post('2fa-check')
  async checkTwoAuth(@Body('username') username: string) {
    const user = await this.usersService.getUser({ username });
    return user?.twoAuthOn || null;
  }
  @Put('update_profile')
  @UsePipes(new ProfileValidationPipe(updateProfileSchema))
  async updateProfile(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() updatedUser: Partial<UpdateProfileDto>
  ) {
    if (updatedUser.username !== undefined) {
      const checkUsername = await this.usersService.getUser({
        username: updatedUser.username
      });

      if (checkUsername)
        throw new HttpException('Invalid Username', HttpStatus.BAD_REQUEST);

      const usernameAndHash = req.cookies.api_token;
      const currentUser = await this.usersService.getUser(req.user);
      if (!currentUser)
        throw new HttpException('Invalid User', HttpStatus.UNAUTHORIZED);

      // eslint-disable-next-line
      const [username, hash] = usernameAndHash.split('|');
      const newCookie = `${updatedUser.username}|${hash}`;
      res.cookie('api_token', newCookie, {
        maxAge: currentUser.maxAge,
        sameSite: 'lax',
        httpOnly: true
      });
    }

    if (updatedUser.password !== undefined) {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const hashPassword = await bcrypt.hash(updatedUser.password, salt);
      updatedUser.password = hashPassword;
    }
    await this.usersService.updateUser(req.user, updatedUser);
  }

  @Put('update')
  async updateUser(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() updateObject: Prisma.UsersUpdateInput
  ) {
    // update cookie with new username
    if (updateObject.username !== undefined) {
      const checkUsername = await this.usersService.getUser({
        username: updateObject.username as string
      });

      if (checkUsername) {
        // handle error this should return null
      }

      const usernameAndHash = req.cookies.api_token;
      const user = await this.usersService.getUser(req.user);
      if (!user) {
        return;
      }

      // eslint-disable-next-line
      const [username, hash] = usernameAndHash.split('|');
      const newCookie = `${updateObject.username}|${hash}`;
      res.cookie('api_token', newCookie, {
        maxAge: user.maxAge,
        sameSite: 'lax',
        httpOnly: true
      });
    }

    if (updateObject.password !== undefined) {
      const salt = await bcrypt.genSalt(CONST_SALT);
      const hashPassword = await bcrypt.hash(
        updateObject.password as string,
        salt
      );
      updateObject.password = hashPassword;
    }
    await this.usersService.updateUser(req.user, updateObject);
  }
}
