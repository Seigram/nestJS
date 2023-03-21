import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';

@Controller('api/workspaces/:url')
export class WorkspacesController {
    @Get()
    getMyWorkspaces() {

    }

    @Post()
    createWorkspace(){

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
