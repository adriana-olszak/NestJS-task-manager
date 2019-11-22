import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        // duplicate user name
        throw new ConflictException('User with that username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validate(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        // duplicate user name
        throw new ConflictException('User with that username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
