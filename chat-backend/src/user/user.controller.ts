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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

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

// 使用示例
const verificationCode = generateRandomCode();
console.log('随机验证码:', verificationCode);

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

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
