/*
    UserCache完成对登录用户信息的缓存
    1 CACHE_EXPIRE缓存时间
    2 genToken获取8位长度的唯一标识
    3 refresh刷新Token的缓存时间(用户在登录之后的一些action必定需要刷新缓存时间)
    4 isValid用以检测某个Token是否合法
*/


import * as _ from 'underscore';
import {CACHE_EXPIRE} from './conf';


interface CacheItem<T> { data: T, token: string, expire: number };

interface IUser {
    name: string;
}

class UserCache {
    private cache: CacheItem<IUser>[];
    // 缓存时间
    private CACHE_EXPIRE: number;


    constructor() {
        this.cache = [];
        this.CACHE_EXPIRE = CACHE_EXPIRE;
    }

    add(username: string): string {
        let token = this.genToken();
        let expire = this.genExpire();
        let us = { name: username } as IUser;
        this.cache.push({ data: us, token, expire });
        return token;
    }

    remove(username: string) {
        this.cache = _.filter(this.cache, item => item.data.name != username);
    }

    // token是否合法
    // 1 是否存在
    // 2 是否过期
    isValid(token: string): boolean {
        let item = this.findCache(token);

        if (!item) { return false; }

        if (Date.now() > item.expire) { return false; }

        return true;
    }

    // 通过token寻找username
    getUsername(token: string): string {
        let item = this.findCache(token);
        return item ? item.data.name : undefined;
    }

    // 刷新token
    refresh(token: string): boolean {
        if (!this.isValid(token)) { return false }

        let item = this.findCache(token);
        item.expire = this.genExpire();
        return true;
    }


    private genToken(len: number = 8): string {
        // return '12345678';
        // let len = 8;
        return Math.floor(Math.random() * Math.pow(36, len)).toString(36);
    }

    private findCache(token: string): CacheItem<IUser> {
        return _.find(this.cache, item => item.token == token);
    }

    private genExpire(): number {
        return Date.now() + this.CACHE_EXPIRE;
    }

}


let usCache: UserCache;
export let getUserCache = () => {
    usCache = usCache || new UserCache();
    return usCache
};
