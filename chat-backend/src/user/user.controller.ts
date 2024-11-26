import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

function generateRandomCode(length = 6) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}
  @ApiOperation({
    summary: '用户注册',
    description: '创建一个新用户的接口，包含注册逻辑',
  })
  @Post('/register')
  create(@Body() createUserDto: RegisterUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiOperation({
    summary: '用户注册的验证码',
    description: '用户注册的验证码',
  })
  @Post('/register/email/send')
  async sendRegisterEmail(@Query('path') path: string) {
    const code = generateRandomCode();
    await this.emailService.sendMail({
      to: path,
      subject: '验证码',
      html: code,
    });
    await this.redisService.set(path, code);
    return `发送成功,验证码是${code}`;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
