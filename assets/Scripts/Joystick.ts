import { _decorator, CCFloat, Component, EventHandler, EventTouch, Node, UITransform, Vec2, Vec3, view, Camera, Size, misc, input, Input } from 'cc';
import { GameModel } from './GameModel';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {

    @property({ type: Node })
    private arrowsNode: Node = null;

    @property({ type: [EventHandler] })
    private axisEvents: EventHandler[] = [];
    @property(GameModel)
    private GameModel: GameModel;

    @property(Node) tick: Node;
    @property(Camera) camera: Camera;

    private size: number;
    private screenSize: Vec2;
    private targetRotation: number = 0; 
    private isRotation:boolean=false;
    ballChange: Vec3;
    startPos: Vec3;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.screenSize = new Vec2(view.getVisibleSize().width, view.getVisibleSize().height);
        this.node.getComponent(UITransform).contentSize = new Size(view.getVisibleSize().width, view.getVisibleSize().width)
        this.size = Math.min(this.screenSize.x, this.screenSize.y) * 0.1; // Adjust as needed
        // this.uiTf.contentSize = (new Size(3000,3000))
        // console.log(this.screenSize)
    }

    // protected update(dt: number): void {
    //     const currentRotation = this.GameModel.Body.eulerAngles.z;
    //     const rotationDelta = this.targetRotation - currentRotation;
    //     const smoothRotation = currentRotation + rotationDelta * dt * 8;
    //     if(this.isRotation===false)
    //     {
       
          
    //         this.GameModel.Body.setRotationFromEuler(0, 0, smoothRotation);
    //         // this.GameModel.Body.getComponent(Collider2D).apply();
    //     }
    // }

    private onTouchStart(event: EventTouch): void {
   

        this.node.getComponent(UITransform).contentSize = new Size(view.getVisibleSize().width, view.getVisibleSize().width)
        this.node.position = Vec3.ZERO;
        this.startPos = new Vec3(event.getLocationX(), event.getLocationY());
        this.ballChange = this.camera.screenToWorld(this.startPos, this.ballChange);
        this.tick.position = this.ballChange;
        this.tick.active = true;
        this.onBegin(new Vec2(this.tick.position.x, this.tick.position.y));
    }

    private onTouchMove(event: EventTouch): void {
        
        this.startPos = new Vec3(event.getLocationX(), event.getLocationY());
        this.ballChange = this.camera.screenToWorld(this.startPos, this.ballChange);
    }

    private onTouchEnd(event: EventTouch): void {
        this.tick.active = false;
        this.onEnd();
    }

    private onTouchCancel(event: EventTouch): void {
        this.onEnd();
    }

    private onBegin(screenPosition: Vec2): void {
        let position = new Vec3();
        position = this.node.inverseTransformPoint(position, new Vec3(screenPosition.x, screenPosition.y, 0.0));
        const length = position.length();
        if (length > this.size) {
            position.x = position.x * this.size / length;
            position.y = position.y * this.size / length;
        }
        this.arrowsNode.position = (position);


        const axis = new Vec2(position.x / this.size, position.y / this.size);
        EventHandler.emitEvents(this.axisEvents, this, axis);
    }

    private onEnd(): void {
        this.arrowsNode.setPosition(Vec3.ZERO);
        EventHandler.emitEvents(this.axisEvents, this, Vec2.ZERO);
    }
}
