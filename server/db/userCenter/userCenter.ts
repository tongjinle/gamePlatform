/*
    用户中心,用以跟数据库沟通
    ** 此处暂时用userCache来做处理
*/
import * as _ from 'underscore';
import { getUserCache } from './userCache';

let usCache = getUserCache();

// ### mock data
let mockUserList = [
    { username: 'falcon', password: '' },
    { username: 'dino', password: '' },
    { username: 'jack', password: '123456' },
    { username: 'tom', password: '123456' },
];
// ###

class UserCenter {

    constructor() {
        // code...
    }


    login(username: string, password: string, cb?: (data: { flag: boolean, token: string }) => void) {
        if (!!usCache.find(username)) {
            cb && cb({ flag: false, token: undefined });
            return;
        }

        if (!_.find(mockUserList, item => item.username == username && item.password == password)) {
            cb && cb({ flag: false, token: undefined });
            return;

        }

        let token = usCache.add(username);
        let flag = true;
        cb && cb({ flag, token });
    }

    logout(username: string, cb?: (data: { flag: boolean }) => void) {
        let flag = !!usCache.find(username);
        if (flag) {
            usCache.remove(username);
        }
        cb && cb({ flag });
    }
}

let uc: UserCenter;
export let getUserCenter = () => {
    uc = uc || new UserCenter();
    return uc;
};
