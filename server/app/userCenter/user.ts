import { UserStatus, UserGameStatus } from '../../status';

class User {
    name: string;
    usStatus: UserStatus;
    gaStatus: UserGameStatus;
    path: string[];

    constructor(username:string) {
        this.name = username;
        this.usStatus = UserStatus.waiting;
        this.gaStatus = undefined;
        this.path = [];
    }
}


export default User;