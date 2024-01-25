import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
export type DataUser = {
    highScore: number,
    checkLog: Object
}

@ccclass('Constants')
export class Constants extends Component {
    public static readonly BEST_SCORE_KEY: string = 'BestScore_destroyTank';
    public static volumeGameStatic: number = 1;
    public static bestScoreStatic: number = 0;
    public static readonly sceneEntry: string = 'Menu';
    public static readonly sceneGame: string = 'Main';

    public static readonly NODE_NAME = {
        GameClient: 'GameClient'
    }

    public static dataUser: DataUser = {
        highScore: 0,
        checkLog: {}
    }
}


