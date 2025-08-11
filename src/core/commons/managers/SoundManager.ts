import { CommonAssetsManager } from "./CommonAssetsManager";

export class SoundManager {
  public static Play(id: AssetId, volume = 1) {
    const sound = CommonAssetsManager.GetSound(id);
    sound.volume = volume;
    sound.play();
  }
}