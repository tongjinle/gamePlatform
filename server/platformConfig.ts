interface IPlatformConfig {
	channelList: { name: string, gameType: string, maxRoomCount: number, maxUserCount: number }[]
};
let config: IPlatformConfig = {
	channelList: [
		{ gameType: "guojixiangqi", name: "国际象棋", maxRoomCount: 100, maxUserCount: 100 },
		{ gameType: "xiangqi", name: "象棋", maxRoomCount: 50, maxUserCount: 100 },
		{ gameType: "weiqi", name: "围棋", maxRoomCount: 100, maxUserCount: 100 }
	]
};

let PlatformConfig = config;
export { IPlatformConfig, PlatformConfig };