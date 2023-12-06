import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
  ) {}

  async createUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    telephone: string,
    role: string,
  ) {
    const user = await this.user.findOne({ where: { email: email } });

    if (user) {
      return { data: null, error: 'User already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const create_user = await this.user.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      telephone: telephone,
      role: role,
    });

    return await this.user
      .save(create_user)
      .then((data) => {
        return { data: data, error: null };
      })
      .catch((error) => {
        return { data: null, error: error.toString() };
      });
  }

  async loginUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.user.findOne({ where: { email: email } });
    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }
  buildUserResponse(user: UserEntity): any {
    return {
      email: user.email,
      token: this.generateJwtToken(user),
    };
  }

  generateJwtToken(user: UserEntity): string {
    return sign(
      {
        email: user.email,
      },
      'JWT_SECRET',
    );
  }

  async getAllUsers() {
    return await this.user.find();
  }

  async getOnebyId(user_id: string): Promise<UserEntity> {
    const user = await this.user.findOne({ where: { user_id: user_id } });

    if (user) {
      return user;
    }
  }

  async getAllbyRole(role: string): Promise<UserEntity[]> {
    return await this.user.find({ where: { role: role } });
  }

  async updateRole(user_id: string, role: string): Promise<UserEntity> {
    const user = await this.user.findOne({ where: { user_id: user_id } });
    if (user) {
      user.role = role;
      await this.user.save(user);
    }
    return user;
  }

  async getOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    return await this.user
      .findOne({
        where: {
          email: email,
          password: password,
        },
      })
      .then((data) => {
        if (data) {
          delete data.password; // Hide password
        }
        return data;
      });
  }

  async getOneByEmail(email: string): Promise<UserEntity> {
    return await this.user
      .findOne({
        where: {
          email: email,
        },
      })
      .then((data) => {
        if (data) {
          delete data.password;
        }
        return data;
      });
  }

  async getOneByTelephone(telephoneNumber: string) {
    return await this.user
      .findOne({
        where: {
          telephone: telephoneNumber,
        },
      })
      .then((data) => {
        if (data) {
          delete data.password; // Hide password
        }
        return data;
      });
  }

  async setRole(id: string, new_role: string) {
    const find_user = await this.user.findOne({ where: { user_id: id } });
    if (find_user) {
      find_user.password = new_role;
      this.user.save(find_user);
    }
  }
}
