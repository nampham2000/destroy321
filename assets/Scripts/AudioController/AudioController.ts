import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import { Constants } from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    @property({type:AudioSource})
    private audioSource: AudioSource;

    @property({ type: [AudioClip] })
    private audioClips: AudioClip[] = [];

    public onAudio(index: number): void {
        let clip: AudioClip = this.audioClips[index];
        this.audioSource.playOneShot(clip);
    }

    public settingAudio(number: number): void {
        this.audioSource.volume = number;
    }

    public updateSound(): void{
        this.audioSource.volume = Constants.volumeGameStatic;
    }

    public pauseVolum():void
    {
        this.audioSource.pause();
    }

    public countinueVolum():void
    {
        this.audioSource.play();
    }
}


