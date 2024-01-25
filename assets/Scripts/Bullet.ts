import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact,RigidBody2D, Vec2, Vec3 } from 'cc';
const { ccclass, property,requireComponent } = _decorator;

@ccclass('Bullet')
@requireComponent(RigidBody2D)
@requireComponent(Collider2D)
export class Bullet extends Component {
    private rigidbody:RigidBody2D;
    private collider:Collider2D;
    protected onLoad(): void {
        this.rigidbody=this.node.getComponent(RigidBody2D);
        this.collider=this.node.getComponent(Collider2D);
    }

    protected start(): void {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
    }

    private onCollision (selfCollider:Collider2D,otherCollider:Collider2D,contact:IPhysics2DContact):void
    { 
        this.scheduleOnce(()=>{
            this.node.position=new Vec3(0,0);
            this.rigidbody.linearVelocity = new Vec2(0.0, 0.0);
            this.node.active=false;
        })
    }
}


