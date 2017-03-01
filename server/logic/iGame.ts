enum GameStatus{
    prepare,
    running,
    end
}

interface IGame {
    // 游戏名字
    name: string;
    // 用户列表
    usernameList: string[];
    // 开始游戏
    start(): void;
    // 暂停游戏
    pause(): void;
    // 恢复游戏
    resume(): void;
    // 操作
    act(gameAction: IGameAction): IGameRst;
    // 释放
    dispose():void;
    // 状态
    status: GameStatus;
}

// 回合制游戏（比如棋牌游戏）
interface IRoundGame extends IGame {
    // 当前玩家
    currUsername: string;
    // 切换玩家
    round(): string;

}

// 游戏操作的数据格式
interface IGameAction { }

// 游戏操作之后的结果
interface IGameRst { }

// 游戏规则描述
/*
    beta 0.1
    1 介绍
    2 最少游戏人数
    3 最大游戏人数
*/
interface IGameRule {
    desc:string;
    minUserCount:number;
    maxUserCount:number;
}




export {
    IGame,
    IRoundGame,
    IGameRule,
    IGameAction,
    IGameRst
};





