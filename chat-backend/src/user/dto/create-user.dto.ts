import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test', description: '用户名' })
  username: string;
  @ApiProperty({ example: '123456', description: '密码' })
  password: string;
  @ApiProperty({ example: '123456', description: '昵称' })
  nickName: string;
  @ApiProperty({ example: '123456@qq.com', description: '邮箱' })
  email: string;
}

export class RegisterUserDto extends CreateUserDto {
  @ApiProperty({ example: '123456', description: '验证码' })
  code: string;
}
