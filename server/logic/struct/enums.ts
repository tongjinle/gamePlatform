// 聊天类型
// 世界聊天,房间聊天,私人聊天
export enum EChatType {
	World,
	Room,
	Personal
};

// 在线, 离线
export enum EPlatformStatus {
	Online,
	Offline
};

// 空闲,观战,游戏中
export enum EGameStatus {
	Free,
	Watch,
	Play
};


// 队伍颜色
export enum EFlagColor {
	Black,
	Red,
	Green
};

// 游戏类型[即种类]
export enum EGameType {
	Sanguo,
	ChineseChess
};


// 房间状态
// 进行中,暂停,结束
export enum ERoomStatus{
	Play,
	Pause,
	End
};

// 离开房间的方式
export enum ELeaveRoomReason{
	// 超过房间生命周期而自动离开
	Auto,
	// 主动离开
	Active,
	// 被房主赶走
	Deactive
};

// 房间游戏结束的原因
export enum EEndGameReason{
	// 以胜负结果来正常结束
	Normal,
	// 有人投降
	Surrender,
	// 断线超时
	Overtime
};