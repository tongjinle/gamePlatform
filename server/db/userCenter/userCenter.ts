/*
    用户中心,用以跟数据库沟通
    ** 此处暂时用userCache来做处理
*/

import { getUserCache } from './userCache';
let usCache = getUserCache();


class UserCenter {

    constructor() {
        // code...
    }


    login(username: string, password: string, cb: (data: { flag: boolean, token: string }) => void) {
        let token = usCache.add(username);
        let flag = true;
        cb({ flag, token });
    }
}

let uc: UserCenter;
export let getUserCenter = () => {
    uc = uc || new UserCenter();
    return uc;
};
