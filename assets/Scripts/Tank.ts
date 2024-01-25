import { _decorator, Button, Collider2D, Component, Contact2DType, director, EventTouch, Input, input, instantiate, IPhysics2DContact, math, Animation, Node, Quat, randomRange, RigidBody2D, tween, v3, Vec2, Vec3, view, misc, find, Color, Sprite, Tween, log, Camera, Prefab, } from "cc";
import { GameModel } from "./GameModel";
import { GameView } from "./GameView";
import { AudioController } from "./AudioController/AudioController";
import { Constants } from "./Data/Constants";
import { GameCenterController } from "./GameCenterController/GameCenterController";
import { BaseEnemy } from "./Logo/BaseEnemy";
const { ccclass, property } = _decorator;
let matchId: string;
@ccclass("Tank")
export class Tank extends Component {
  @property(GameModel)
  private GameModel: GameModel;
  @property(GameView)
  private GameView: GameView;
  @property({ type: AudioController })
  private audioController: AudioController;
  @property({ type: GameCenterController })
  private gameCenter: GameCenterController;
  @property(Button)
  private listButton: Button[] = [];
  @property({
    type: Node,
    tooltip: 'Bullet Parent'
  })
  private bulletParent: Node;

  @property({
    type: Camera,
    tooltip: 'Camera'
  })
  private camera: Camera;

  @property(Prefab)
  private MonsterPrefab: Prefab;

  @property(Node)
  private MonstersNode: Node;

  @property(Node)
  private CloneMonstersNode: Node;

  private time: number = 0;
  private angularSpeed: number = 120;
  private basketTransition: number = 0.0;
  private Score = 0;
  private move_size = 100;
  private angle: number;
  private enemyamount: number = 0;
  private speedInscre: number = 20;
  private scoreProcess: number = 0;
  private volum: number = 0;
  private maxMonsters: number = 10;
  private monsterCount: number = 0;
  private monsterPrefabsCount: number = 1;
  private gameClient;
  private isCreated: boolean = true;
  private listTween: Tween<Node>[] = [];
  private isTrueBullet: boolean = true;
  private firerate: number = 600;
  private nextfire: number;
  private startMousePos: Vec3;
  private mouseChange: Vec3;
  private targetRotation: number = 0;
  private isRotation: boolean = false;
  private enemy;
  private delta: number = 0;
  private monsters: (BaseEnemy)[] = [];
  private enemyTypes: { enemyClass: typeof BaseEnemy, prefab: Prefab }[] = [];
  private gameover:boolean=false;
  private dmgHit:number=2
  protected onLoad(): void {
    this.gameCenter.startMatch(()=>{
    this.startMatchLog();
    this.enemyTypes = [
      { enemyClass: BaseEnemy, prefab: this.MonsterPrefab }
    ];
    director.resume();
    this.nextfire = 0;
    this.audioController.updateSound();
    input.on(Input.EventType.TOUCH_START, this.changDirection, this);
    input.on(Input.EventType.TOUCH_MOVE, this.changDirection, this);
    this.GameView.Soundslide.progress = Constants.volumeGameStatic;
    this.GameView.SoundBar.progress = Constants.volumeGameStatic;
    this.GameModel.Tank.setPosition(new Vec3(0, 0, 0));
    input.on(Input.EventType.TOUCH_START, this.Shoot, this);
    if (this.GameView.PanelLose.active === true) {
      this.GameView.PanelLose.active = false;
    }
    const collider1 = this.GameModel.Tank.getComponent(Collider2D);
    if (collider1) {
      collider1.on(Contact2DType.BEGIN_CONTACT, this.onCollisionTank, this);
    }
    for (let button of this.listButton) {
      button.node.on(Node.EventType.MOUSE_ENTER, () => {
        this.onMouseEnter(button.node);
      }, this);
      button.node.on(Node.EventType.MOUSE_LEAVE, () => {
        this.onMouseLeave(button.node);
      }, this);
    }
    });
  }
  
  protected update(deltaTime: number) {
    if(this.enemyTypes[0].prefab)
    {
      this.getMonster();
      this.getAllMonstersFromNode();
      this.monsters.forEach((monster) => {
        if (monster.node.active&&this.gameover===false) {
          monster.move(deltaTime, this.GameModel.Tank, 50);
          if (this.GameModel.Tank) {
            const tankclone = this.GameModel.Tank.position.clone();
            const direction = tankclone.subtract(monster.node.position);
            const angle = Math.atan2(direction.y, direction.x);
            const rotationQuat = new Quat();
            Quat.fromEuler(rotationQuat, 0, 0, misc.radiansToDegrees(angle) - 90);
            monster.node.setRotation(rotationQuat);
          }
        }
      });
    }
    if (this.Score === this.scoreProcess + 18) {
      this.scoreProcess += 18;
      this.speedInscre = this.speedInscre - 8;
      if (this.speedInscre < 6) {
        this.speedInscre = 6;
      }
    }
    const currentRotation = this.GameModel.Body.eulerAngles.z;
    const rotationDelta = this.targetRotation - currentRotation;
    const smoothRotation = currentRotation + rotationDelta * deltaTime * 8;
    if (this.isRotation === false) {
      this.GameModel.Body.setRotationFromEuler(0, 0, smoothRotation);
      // this.GameModel.Body.getComponent(Collider2D).apply();
    }
    // this.spawnEnemy(this.speedInscre,deltaTime);
    this.Shoot();
    this.GameView.BestScore.string = `BEST SCORE: ${Constants.dataUser.highScore}`;
    this.GameView.Score.string = `SCORE: ${this.Score}`;
  }

  private getMonster(): BaseEnemy {
    for (let i = 0; i < this.monsters.length; i++) {
      if (!this.monsters[i].node.activeInHierarchy) {
        this.monsters[i].node.active = true;
        return this.monsters[i];
      }
    }
    if (this.monsterCount < this.maxMonsters * this.monsterPrefabsCount) {
      const monsterPrefab = this.enemyTypes[0].prefab;
      const monsterNode = instantiate(monsterPrefab);
      let pos = this.getRandomPositionOutsideScreen();
      monsterNode.setPosition(pos);
      monsterNode.parent = this.MonstersNode;
      let monster: BaseEnemy;
      monster = monsterNode.addComponent(BaseEnemy);
      monster.startPos = pos.clone();
      this.monsters.push(monster);
      this.monsterCount++;
      return monster;
    }
    return null;
  }

  private getAllMonstersFromNode(): void {
    const children = this.CloneMonstersNode.children;
    children.forEach((child) => {
      child.getComponent(BaseEnemy).move(this.delta, this.GameModel.Tank, 50);
    });
  }

  private onCollision(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
    this.scheduleOnce(() => {
      selfCollider.node.position = new Vec3(0, 0, 0);
      selfCollider.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0.0, 0.0);
      selfCollider.node.active = false;
    });
    if (otherCollider.tag === 1) {
      const enemy = otherCollider.node;
      enemy.getComponent(BaseEnemy).hitCounter++
      if(this.Score>20&&this.dmgHit<=50)
      {
        this.dmgHit=3
      }
      if(this.Score>50&&this.dmgHit<=70)
      {
        this.dmgHit=4;
      }
      if(this.Score>70)
      {
        this.dmgHit=4;
      }
      if(enemy.getComponent(BaseEnemy).hitCounter===this.dmgHit)
      {
      this.GameView.Boom.node.position = new Vec3(enemy.position.x + 20, enemy.position.y);
      this.GameView.Boom.play();
      // enemy.removeFromParent();
      enemy.active = false;
      enemy.position = this.getRandomPositionOutsideScreen();
      this.Score++;
      this.audioController.onAudio(1);
      enemy.getComponent(BaseEnemy).hitCounter=0;
      }
    }
  }

  private onCollisionTank(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
    if (otherCollider.tag === 1) {
      this.gameover=true;
      this.GameView.BoomT.node.position = new Vec3(this.GameModel.Tank.position.x, this.GameModel.Tank.position.y);
      this.GameView.BoomT.play();
      this.GameModel.Tank.active = false;
      this.audioController.onAudio(2);
      this.audioController.pauseVolum();
      this.isTrueBullet = false;
      this.bulletParent.active = false;
      input.off(Input.EventType.TOUCH_START, this.Shoot, this);
      this.scheduleOnce(function () {
        this.GameView.panelLose.active = true;
        this.listTween.map((tw) => tw.stop());
        this.GameView.pauseButton.node.active = false;
      }, 1.2);
      if (this.isCreated) {
        this.isCreated = false;
        this.gameCenter.completeMatch(() => { }, {
          score: Math.floor(this.Score),
        });
      }
      this.saveBestScore();
    }
  }



  private Shoot(): void {
    if (Date.now() > this.nextfire) {
      this.nextfire = Date.now() + this.firerate
      if (this.GameModel.ObjectPool.GetPooledOjects() !== null) {
        const power = 0.1;
        const nearestEnemy = this.findNearestEnemy();
        if (nearestEnemy) {
          const bullet = this.GameModel.ObjectPool.GetPooledOjects();
          let bulletLinear = bullet.getComponent(RigidBody2D);
          bullet.setPosition(this.GameModel.Tank.position);
          bullet.active = true;
          const directionToEnemy = nearestEnemy.position.clone().subtract(bullet.position);
          const velocityX = directionToEnemy.x * power;
          const velocityY = directionToEnemy.y * power;
          if (this.isTrueBullet === true) {
            bulletLinear.linearVelocity = new Vec2(velocityX, velocityY);
            const rotationAngle = Math.atan2(directionToEnemy.y, directionToEnemy.x) * 180 / Math.PI;
            this.GameModel.Turret.setRotationFromEuler(0, 0, rotationAngle);
          }
          this.audioController.onAudio(0);
          const collider = bullet.getComponent(Collider2D);
          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollision, this);
          }
        }
      }
    }
  }

  private findNearestEnemy(): Node | null {
    let nearestEnemy = null;
    let minDistance = Number.MAX_VALUE;

    for (const enemy of this.GameModel.EnemeyNode.children) {
      if (enemy.position.y > 260 || enemy.position.y < - 260) continue;
      if (enemy.position.x > 350|| enemy.position.x<-350) continue;
      let sub = this.GameModel.Tank.position.clone().subtract(enemy.position);
      const distance = sub.length();
      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    }

    return nearestEnemy;
  }

  private changDirection(event: EventTouch): void {
    this.startMousePos = new Vec3(event.getLocationX(), event.getLocationY());
    this.mouseChange = this.camera.screenToWorld(this.startMousePos, this.mouseChange);
    const direction = this.mouseChange.subtract(this.GameModel.Body.position);
    const angle = Math.atan2(direction.y, direction.x);
    this.targetRotation = misc.radiansToDegrees(angle) - 90;
  }

  private getRandomPositionOutsideScreen(): Vec3 {
    const screenSize = view.getVisibleSize();
    const screenWidth = screenSize.width;
    const screenHeight = screenSize.height;
    const padding = 100;
    let randomX = 0;
    let randomY = 0;
    if (Math.random() < 0.5) {
      randomX = randomRange(-screenWidth - padding, -padding);
    } else {
      randomX = randomRange(screenWidth + padding, screenWidth);
    }
    if (Math.random() < 0.5) {
      randomY = randomRange(-screenHeight - padding, -padding);
    } else {
      randomY = randomRange(screenHeight + padding, screenHeight);
    }
    return new Vec3(randomX, randomY, 0);
  }

  private degreesToRadians(degress: number): number {
    return degress * (Math.PI / 180);
  }

  private Playagian(): void {
    director.loadScene("Main");
  }

  private MenuButton(): void {
    director.loadScene("Menu");
  }

  protected HandleAudioStorage(): void {
    if (Constants.volumeGameStatic !== 1) {
      this.volum = Constants.volumeGameStatic;
    }
  }

  private SoundOption(): void {
    this.audioController.settingAudio(this.volum);
  }

  private SlideSound(): void {
    this.volum = this.GameView.Soundslide.progress;
    this.GameView.SoundBar.progress = this.volum;
    Constants.volumeGameStatic = this.volum;
    this.SoundOption();
  }

  private PauseOption(): void {
    director.pause();

    this.GameView.Pause.active = true;
    this.GameView.PauseButton.node.active = false;

    this.audioController.pauseVolum();
    input.off(Input.EventType.TOUCH_START, this.Shoot, this);
  }

  private Countinue(): void {
    director.resume();
    this.GameView.Pause.active = false;
    this.GameView.PauseButton.node.active = true;
    this.audioController.countinueVolum();
    input.on(Input.EventType.TOUCH_START, this.Shoot, this);
  }

  private saveBestScore(): void {
    Constants.dataUser.highScore = Constants.dataUser.highScore < this.Score ? this.Score : Constants.dataUser.highScore;
  }

  private onMouseEnter(node: Node): void {
    let btnplayColor = node.getComponent(Sprite);
    btnplayColor.color = new Color(195, 195, 195, 255);
  }

  private onMouseLeave(node): void {
    let btnplayColor = node.getComponent(Sprite)
    btnplayColor.color = Color.WHITE;
  }

  public startMatchLog(): void {
    let id = setInterval(() => {
      if (!this.isCreated) {
        clearInterval(id);
        return;
      }
      this.gameCenter.logMatch({ score: this.Score })
    }, 1000)
  }
}
