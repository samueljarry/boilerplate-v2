import { Action } from "../utils/Action.js";
import { AssetsId } from "../constants/AssetsId.js";
import { AssetsType } from "../constants/AssetsType.js";
import { ImageLoader } from "../loaders/ImageLoader.js";
import { SoundLoader } from "../loaders/SoundLoader.js";
import { VideoLoader } from "../loaders/VideoLoader.js";
import { getOrThrowError } from '../utils/getOrThrow';

type AssetToLoad = {
  path: string;
  type: AssetsType;
};

const assetToLoad = (path: string, type: AssetsType): AssetToLoad => ({
  path,
  type,
});

export class CommonAssetsManager {
  private static _Queue = new Map<AssetId, AssetToLoad>();
  private static _VideosMap = new Map<AssetId, HTMLVideoElement>();
  private static _ImagesMap = new Map<AssetId, HTMLImageElement>();
  private static _SoundsMap = new Map<AssetId, HTMLAudioElement>();
  public static Loaded = 0;
  public static OnAssetLoaded = new Action();

  public static AddVideo(videoId: AssetId, videoPath: string): void {
    this._Queue.set(videoId, assetToLoad(videoPath, AssetsType.VIDEO));
  }

  public static AddImage(imageId: AssetId, imagePath: string): void {
    this._Queue.set(imageId, assetToLoad(imagePath, AssetsType.IMAGE));
  }

  public static AddImageWithoutId(imagePath: string): void {
    this._Queue.set(AssetsId.NULL, assetToLoad(imagePath, AssetsType.IMAGE));
  }

  public static AddSound(soundId: string, soundPath: string): void {
    this._Queue.set(soundId, assetToLoad(soundPath, AssetsType.AUDIO));
  }

  public static async Load(): Promise<void> {
    const updateLoadedAssetsCount = () => {
      this.Loaded++;
      this.OnAssetLoaded.execute();
    };

    const promises = Array.from(this._Queue.entries()).map(
      async ([id, { type, path }]) => {
        let asset = undefined;

        switch (type) {
          case AssetsType.VIDEO:
            asset = await VideoLoader.Load(path);
            updateLoadedAssetsCount();
            this._VideosMap.set(id, asset);
            break;
          case AssetsType.IMAGE:
            asset = await ImageLoader.Load(path);
            updateLoadedAssetsCount();
            this._ImagesMap.set(id, asset);
            break;
          case AssetsType.AUDIO:
            asset = await SoundLoader.Load(path);
            updateLoadedAssetsCount();
            this._SoundsMap.set(id, asset);
            break;
        }
      }
    );

    await Promise.all(promises);
  }

  public static GetVideo(id: AssetId): HTMLVideoElement {
    return getOrThrowError(this._VideosMap, id, `No video found for ${id}`)
  }

  public static GetImage(id: AssetId): HTMLImageElement {
    return getOrThrowError(this._ImagesMap, id, `No image found for ${id}`);
  }

  public static GetSound(id: AssetId): HTMLAudioElement {
    return getOrThrowError(this._SoundsMap, id, `No sound found for ${id}`);
  }
}
