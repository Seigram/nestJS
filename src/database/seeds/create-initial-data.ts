import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import {Workspaces} from "../../entities/Workspaces";
import {Channels} from "../../entities/Channels";


//seeder와 faker 조합도 좋다.
export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager //Random 회원들 만들 때 fake 데이터 만들 때
    ): Promise<any> {
        const workspacesRepository = dataSource.getRepository(Workspaces);
        await workspacesRepository.insert([{
            id: 1, name: 'Sleact', url: 'sleact'
        }])
        const channelsRepository = dataSource.getRepository(Channels);
        await channelsRepository.insert([{
            id: 1, name: '일반', WorkspaceId: 1, private: false
        }]);
    }
}
