let glo = {
    token: undefined,
    soRoom: undefined,
    userList: undefined
};

$(() => {
    let so = io('http://localhost:9527');
    let token;

    so.emit('platform_user_join', {
        username: 'tongjinle-'+Math.ceil(Math.random()*1000),
        password: '123456'
    });

    so.on('platform_user_join', (data) => {
        console.log(data);
        if (data.flag) {
            console.log('登录成功');
            
        }
    });

    so.on('socket_room_join',(data)=>{
        let {roomType,roomName} = data;
        so.emit('userList.refresh', {
            roomName
        });
    });

    so.on('platform_user_leave',(data)=>{
        let {username} = data;
        renderUserList([{username}],'remove');
    });


    so.on('userList.refresh', (data) => {
        // if(type == 'all'){
        //     glo.userList = data.userList;
        // }
        if(data.flag){
            renderUserList(data.userList,data. type);
            
        }else{
            console.error('req userlist fail');
        }
    });


    // client 才有reconnect事件
    so.on('reconnect',(data)=>{
        console.log('reconnect',data);
    });
});


let renderUserList = (userList, type) => {
    let ulNode = $('#userList');
    if ('all' == type) {
        ulNode.empty();
        _.each(userList, us => {
            ulNode.append(`<div>${us.username}</div>`)
        });
    } else if ('add' == type) {

        _.each(userList, us => {
            ulNode.append(`<div>${us.username}</div>`)
        });

    } else if ('remove' == type) {
        _.each(userList, us => {
            ulNode.append(`<div>${us.username}</div>`);
        });
        ulNode.find('div').each(() => {
            let di = $(this);
            _.each(userList, us => {
                if (di.text() == us.username) {
                    di.remove();
                }
            });
        });
    }
};