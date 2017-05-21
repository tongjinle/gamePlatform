import * as _ from "underscore";
import * as $ from "jquery";
import * as io from "socket.io-client";
import * as async from "async";

let so: SocketIOClient.Socket = io("http://localhost:9527");
let $login: JQuery,
    $pathnode: JQuery,
    $userlist: JQuery,
    $chatBox: JQuery
    ;

let username;
let reqs: { [name: string]: Function } = {};

async.parallel([
    (cb) => {
        $(() => {
            $('body').html("hello world1!");
            let $login = $('#login');
            let $pathnode = $('#pathnode');
            cb();
        });
    },
    (cb) => {
        so.on("connect", () => {
            console.log(so.id);
            cb();
        });
    }
], (err, data) => {
    !err && start();
});

function start() {
    initPage();
    initReqs();
    bindSocket();
    bindEvent();
}

_.forEach([1, 21], n => console.log(n));


// 初始化页面
function initPage() {
    $login.show();
    $pathnode.hide();
}



// 主要用于接受来自server的信息
function bindSocket() {
    so.on("login", (data: { flag: boolean }) => {
        let { flag } = data;
        $login.toggle(!flag);
        $pathnode.toggle(flag);

        if (flag) {

        }
    });

    so.on("userlist", (data: { flag: boolean, userlist: string[] }) => {
        let { flag } = data;
        if (flag) {
            $userlist.append(_.map(data.userlist, createUserHtml));
        }
    });


    so.on("chat", (data: {}) => { });
}


// 主要用于
function bindEvent() {
    // login
    $login.click(function() {
        username = $login.find('.username').val();
        let password = $login.find('.password').val();
        reqs['login'](username, password);
    });

    // chat
    $chatBox.find('.sendMessage').click(function() {
        let message: string = $chatBox.find('.inputbox').val();
        let to: string = "";
        if (!message.length) {
            reqs['chat'](message, to);
        }
    });

}

function initReqs() {

    let reqs: { [name: string]: Function } = {};
    // 登陆
    reqs['login'] = function(username: string, password: string) {
        so.emit('login', { username, password });
    };

    // 登出
    reqs['logout'] = function() {
        so.emit('logout');
    };

    // 获取用户
    reqs['userlist'] = function(pathnodeName: string, token: string) {
        so.emit('userlist', { pathnodeName, token });
    };

    // 聊天
    reqs['chat'] = function(message: string, to?: string) {
        so.emit('chat', { message, to });
    };

    return reqs;
}


// 生成user节点
function createUserHtml(username: string) {
    return `<div class="username">${username}</div>`;
}


// 生成message节点
function createMessageHtml(username: string, message: string, isPrivate: boolean, timeStamp: number) {
    let timeFormat = (timeStamp: number) => {
        let time = new Date(timeStamp);
        let str = [time.getHours(), time.getMinutes(), time.getSeconds()].join(':');
        return str;
    };

    return `
        <div class="message"> 
            <span class="username">${username}</span>
            <span class="text ${isPrivate ? 'private' : ''}">${message}</span>
            <span class="timestamp">${timeFormat(timeStamp)}</span>
        </div>
    `;
}