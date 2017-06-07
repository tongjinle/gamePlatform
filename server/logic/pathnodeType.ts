/*
	整个游戏平台成一个树状结构
	每个节点都是Pathnode
	platform(平台)有且仅有一个,作为整棵树的根节点,它有一个或者多个channel节点
	channel(频道),频道可以是"华东区","华中区"这样以区域分类,也"围棋","象棋"这样以游戏类别分类,它用来承载多个游戏实例
	room(房间),房间可以以简单的序号来排列,每个房间对应了一个游戏实例(如果房间已经开启游戏)
*/

enum PathnodeType {
    platform,
    channel,
    room

}

export default PathnodeType;