import * as _ from "underscore";
import * as $ from "jquery";
import * as io from "socket.io-client";
import * as async from "async";
import Reqs from "./reqs";

let so: SocketIOClient.Socket = io("http://localhost:9527");
let $login: JQuery,
    $pathnode: JQuery,
    $userlist: JQuery,
    $chatBox: JQuery
    ;

let g_username: string;
let g_token: string;

const RECEIVER_KEY = 'isPrivateReceiver';
const RECEIVER_CLASS = 'privateReceiver';

let reqs: Reqs;

async.parallel([
    (cb) => {
        $(() => {
            $('body').html(new Date().toLocaleTimeString());
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


    so.on("chat", (data: { flag: boolean, username: string, message: string, isPrivate: boolean, timeStamp: number }) => {
        let { flag, username, message, isPrivate, timeStamp } = data;
        if (flag) {
            $chatBox.find('.messageList').append(createMessageHtml(username, message, isPrivate, timeStamp));
        }

    });
}


// 主要用于
function bindEvent() {
    // login
    $login.click(function() {
        let username = $login.find('.username').val();
        let password = $login.find('.password').val();
        reqs['login'](username, password);
    });

    // chat
    $chatBox.find('.sendMessage').click(function() {
        let message: string = $chatBox.find('.inputbox').val();
        let to: string = getPrivateReceiver();
        if (!message.length) {
            reqs['chat'](message, to);
        }
    });

    // select private receiver
    $userlist.on('click', '.username', function() {
        let key = RECEIVER_KEY;
        let className = RECEIVER_CLASS;
        let flag: boolean = $(this).data(key);
        $(this).data(key, !flag)
        if (flag) {
            $(this).addClass(className);

        } else {
            $(this).removeClass(className);
        }
        $(this).siblings('.username').data(key, false)
            .removeClass(className);;
    });

    // enter subPathnode
    // todo

}

function initReqs() {
    reqs = new Reqs(so);
}

// 获取子级pathnode列表
function getSubPathnodeList(){
    // todo
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

// 获取私密对象
function getPrivateReceiver(): string {
    let receiver: string = undefined;
    $userlist.find('.username').each(function(i, n) {
        if ($(this).data(RECEIVER_KEY)) {
            receiver = $(this).text();
            return false;
        }
    });
    return receiver;
}