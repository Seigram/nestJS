import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query} from '@nestjs/common';
import {WorkspacesService} from "./workspaces.service";
import {Users} from "../entities/Users";
import {User} from "../common/decorators/user.decorator";
import {CreateWorkspaceDto} from "./dto/create-workspace.dto";

@Controller('api/workspaces/:url')
export class WorkspacesController {
    constructor(
        private workSpacesService: WorkspacesService
    ) {}

    @Get('/:myId')
    getMyWorkspaces(@User() user: Users) { //ParseIntPipe 하면 number 가 String으로 들어오는데 자도으로 int number로 바꿔줌
        return this.workSpacesService.findMyWorkspaces(user.id); //+myId
        //배열로도 할수 있음 ParseArrayPipe
    }


    @Post()
    createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto){ //body는 모두 Dto로 만들어야 함
        return this.workSpacesService.createWorkspace(
            body.workspace,
            body.url,
            user.id,
        );
    }

    @Get(':url/members')
    getAllMembersFromWorkspace() {

    }

    @Post(':url/members')
    inviteMembersToWorkspace(){

    }

    @Delete(':url/members/:id')
    kickMembersFromWorkspace(){

    }

    @Get(':url/members/:id')
    getMemberInfoInWorkspace(){

    }
}
