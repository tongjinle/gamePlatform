"use strict";
var _ = require("underscore");
;
var UserCache = (function () {
    function UserCache() {
        this.CACHE_EXPIRE = 2 * 60 * 60 * 1000;
        this.cache = [];
    }
    UserCache.prototype.add = function (username) {
        var token = this.genToken();
        var expire = this.genExpire();
        this.cache.push({ username: username, token: token, expire: expire });
        return token;
    };
    UserCache.prototype.remove = function (username) {
        this.cache = _.filter(this.cache, function (item) { return item.username != username; });
    };
    // token是否合法
    // 1 是否存在
    // 2 是否过期
    UserCache.prototype.isValid = function (token) {
        var item = this.findCache(token);
        if (!item) {
            return false;
        }
        if (Date.now() > item.expire) {
            return false;
        }
        return true;
    };
    // 通过token寻找username
    UserCache.prototype.getUsername = function (token) {
        var item = this.findCache(token);
        return item ? item.username : undefined;
    };
    // 刷新token
    UserCache.prototype.refresh = function (token) {
        if (!this.isValid(token)) {
            return false;
        }
        var item = this.findCache(token);
        item.expire = this.genExpire();
        return true;
    };
    UserCache.prototype.genToken = function (len) {
        if (len === void 0) { len = 8; }
        // return '12345678';
        // let len = 8;
        return Math.floor(Math.random() * Math.pow(36, len)).toString(36);
    };
    UserCache.prototype.findCache = function (token) {
        return _.find(this.cache, function (item) { return item.token == token; });
    };
    UserCache.prototype.genExpire = function () {
        return Date.now() + this.CACHE_EXPIRE;
    };
    return UserCache;
}());
var userCache = new UserCache();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userCache;
