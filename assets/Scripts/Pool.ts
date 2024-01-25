import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export class Pool extends Component {
    private pooledObjects: Node[] = [];
    private amountToPool: number = 50;
    @property({type:Prefab}) 
    private bulletPrefab: Prefab;

    @property(Node)
    private bulletNode: Node; 

    protected start():void {
        for(let i=0;i<this.amountToPool;i++){
            const node = instantiate(this.bulletPrefab);
            node.parent = this.bulletNode;
            node.active=false;
            this.pooledObjects.push(node);
        }
    }

    public GetPooledOjects(){
        for(let i=0;i<this.pooledObjects.length;i++){
            if(!this.pooledObjects[i].active){
                return this.pooledObjects[i];
            }
        }
        return null;
    }
}


