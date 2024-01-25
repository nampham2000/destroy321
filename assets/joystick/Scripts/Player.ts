import { _decorator, CCFloat, Component, math, Node, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

	@property({type: CCFloat})
	private speed: number = 200.0;
	private axis: Vec2 = new Vec2();

	protected update(dt: number): void {
			var offset = this.speed * dt;
			this.node.setPosition(this.node.position.add(v3(this.axis.x * offset, this.axis.y * offset, 0.0)));
			let xPos = math.clamp(this.node.position.x, - 900 / 2, 900 / 2)
        let yPos = math.clamp(this.node.position.y, - 600 / 2 + 50, 600 / 2 - 50)
        this.node.setPosition(new Vec3(xPos, yPos));
	}

	// protected update(dt: number): void {
	// 	console.log("bbb");
		
		
	// }

	public OnMove(event: Event, customEventData: Vec2) {
		this.axis = customEventData;
	}
}


