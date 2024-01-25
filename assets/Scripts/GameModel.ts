import { _decorator, Component, Node, Prefab } from 'cc';
import { Pool } from './Pool';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property({
        type:Node,
        tooltip: 'Tank Node'
    })
    private tank:Node;

    public get Tank() : Node {
        return this.tank
    }
    public set TankValue(v : Node) {
        this.tank = v;
    }


    @property({
        type:Node,
        tooltip: 'Turret Tank Node'
    })
    private turret:Node;

    public get Turret() : Node {
        return this.turret
    }
    public set TurretV(v : Node) {
        this.turret = v;
    }

    @property({
        type:Node,
        tooltip: 'Body Tank Node'
    })
    private body:Node;

    public get Body() : Node {
        return this.body
    }
    public set BodyV(v : Node) {
        this.body = v;
    }

    @property({
        type:Node,
        tooltip: 'Bullet Node'
    })
    private bulletNode:Node;

    public get BulletNodes() : Node {
        return this.bulletNode
    }
    public set BulletNodeValue(v : Node) {
        this.bulletNode = v;
    }

    @property({
        type:Node,
        tooltip: 'Enemy Node'
    })
    private enemyNode:Node;

    public get EnemeyNode() : Node {
        return this.enemyNode
    }
    public set EnemyNodeValue(v : Node) {
        this.enemyNode = v;
    }

    @property({type:Pool})
    private objectPool:Pool;

    public get ObjectPool () : Pool {
        return this.objectPool
    }
    public set ObjectPoolValue (v : Pool) {
        this.objectPool = v;
    }

    @property({
        type:Prefab,
        tooltip: 'Enemy Prefab'
    })
    private enemyPrefab:Prefab;
    
    public get EnemyPrefabs () : Prefab {
        return this.enemyPrefab
    }
    public set EnemyPrefabsValue (v : Prefab) {
        this.enemyPrefab = v;
    }
}


