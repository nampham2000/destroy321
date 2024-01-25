import { _decorator, Button, Component, director, Node } from 'cc';
import { Constants } from './Data/Constants';
import { GameCenterController } from './GameCenterController/GameCenterController';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
    @property({type: Button})
    private btnPlay: Button;

    @property({type:GameCenterController})
    private gameCenter:GameCenterController;
    
    private Play():void{ 
        this.btnPlay.interactable = false;
        director.loadScene(Constants.sceneGame);
    }
}


