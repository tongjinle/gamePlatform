import { IGame, IGameRule } from './iGame';

class GameFactory {
    static createGame(gameType: string, usernameList: string[]): IGame {
        let ga: IGame;
        return ga;
    }

    // 请求游戏规则信息
    static queryGameRule(gameType: string): IGameRule {
        let ru: IGameRule;
        return ru; 
    }
}

export default GameFactory;