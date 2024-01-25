import { _decorator, Animation, AudioSource, Button, Component, Label, Node, ProgressBar, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
   @property({type:Node})
   private panelLose:Node;

   public get PanelLose() : Node {
      return this.panelLose
   }
   public set PanelLoseValue(v : Node) {
      this.panelLose = v;
   }

   @property({type:Label})
   private score:Label
 
   public get Score() : Label {
      return this.score
   }
    
   public set ScoreValue(v : Label) {
      this.score = v;
   }

   @property({type:Label})
   private bestscore:Label
 
   public get BestScore() : Label {
      return this.bestscore
   }
    
   public set BestScoreValue(v : Label) {
      this.bestscore = v;
   }

   @property({type:Node})
   private pause:Node
 
   public get Pause() : Node {
      return this.pause
   }
    
   public set PauseValue(v : Node) {
      this.pause = v;
   }

   @property({type:Slider})
   private soundslide:Slider
 
   public get Soundslide() : Slider {
      return this.soundslide
   }
    
   public set SoundValue(v : Slider) {
      this.soundslide = v;
   }

   @property({type:ProgressBar})
   private soundBar:ProgressBar
 
   public get SoundBar() : ProgressBar {
      return this.soundBar
   }
    
   public set SoundBarValue(v : ProgressBar) {
      this.soundBar = v;
   }

   @property({type:Button})
   private pauseButton:Button
 
   public get PauseButton() : Button {
      return this.pauseButton
   }
    
   public set PauseValue1(v : Button) {
      this.pauseButton = v;
   }

   @property({type:Animation})
   private boomAnim:Animation
 
   public get Boom() : Animation {
      return this.boomAnim
   }
    
   public set Boom(boomAnim : Animation) {
      this.boomAnim = boomAnim;
   }

   @property({type:Animation})
   private boomAnimT:Animation
 
   public get BoomT() : Animation {
      return this.boomAnimT
   }
    
   public set BoomT(boomAnim : Animation) {
      this.boomAnimT = boomAnim;
   }


 
}


