let glo = {
    username: undefined,
    token: undefined,
    roomType:undefined,
    roomName: undefined,
    userList: undefined,
    so: undefined
};

$(() => {
    let so = glo.so = io('http://localhost:9527');
    let token;



    so.on('platform_user_join', (data) => {
        console.log(data);
        if (data.flag) {
            console.log('登录成功');

        }
    });

    so.on('socket_room_join', (data) => {
        let {
            roomType,
            roomName
        } = data;

        glo.roomName = roomName;
        glo.roomType = roomType;

        so.emit('userList.refresh', {
            roomName
        });
    });

    so.on('platform_user_leave', (data) => {
        let {
            username
        } = data;
        renderUserList([{
            username
        }], 'remove');
    });


    so.on('userList.refresh', (data) => {
        // if(type == 'all'){
        //     glo.userList = data.userList;
        // }
        if (data.flag) {
            renderUserList(data.userList, data.type);

        } else {
            console.error('req userlist fail');
        }
    });

    so.on('chat', (data) => {
        let {
            from,
            msg,
            isPrivate
        } = data;
        let clNode = $('#chatList');
        clNode.append(`
                <div>
                    <span class="from">${isPrivate?`[${from}:密]`:`${from}`}</span>
                    <span class="msg">${msg}</span>
                </div>
        `);
    });


    // client 才有reconnect事件
    so.on('reconnect', (data) => {
        console.log('reconnect', data);
        login();
    });


    $('#sendMsg').click(() => {
        let from = glo.username;
        let msg = $('#chatbox').val();
        let toListStr = $('#toList').val().replace(/\s/g, '');
        toList = toListStr.length ? toListStr.split(',') : undefined;
        if (!msg.length) {
            alert('invalid chatmsg');
            return;
        }
        so.emit('chat', {
            from,
            roomName: glo.roomName,
            msg,
            toList
        });
    });

    login();
});

let login = () => {
    let username = glo.username = 'tongjinle-' + Math.ceil(Math.random() * 1000);
    let so = glo.so;
    so.emit('platform_user_join', {
        username,
        password: '123456'
    });
};


let renderUserList = (userList, type) => {
    let ulNode = $('#userList');
    if ('all' == type) {
        ulNode.empty();
        _.each(userList, us => {
            ulNode.append(`<div ${us.username === glo.username?'class="currUsername"':''}>${us.username}</div>`)
        });
    } else if ('add' == type) {

        _.each(userList, us => {
            ulNode.append(`<div>${us.username}</div>`)
        });

    } else if ('remove' == type) {
        ulNode.find('div').each(function(e) {
            let di = $(this);
            _.each(userList, us => {
                if (di.text() == us.username) {
                    di.remove();
                }
            });
        });
    }
};