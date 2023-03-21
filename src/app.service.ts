import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "./users/users.service";

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService, private userService: UsersService) {
  }

  async getHello(){
    this.userService.getUser();
    //this.getWow();
    return process.env.SECRET;
  }

/*  async getUser(): string {
    const user = await User.findOne();
    return  user;
  }

  async withdraw(): string{
  }

  async postUser(): string{
    const user = await User.create();
    return user;
  }*/

}
