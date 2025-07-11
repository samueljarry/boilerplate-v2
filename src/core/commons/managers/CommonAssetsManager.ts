import { Action } from "../utils/Action.js";
import { AssetsId } from "@constants/AssetsId.js";
import { AssetsTypes } from "../constants/AssetsTypes.js";
import { ImageLoader } from "../loaders/ImageLoader.js";
import { SoundLoader } from "../loaders/SoundLoader.js";
import { VideoLoader } from "../loaders/VideoLoader.js";
import { getOrThrowError } from '../utils/getOrThrow';

type AssetToLoad = {
  path: AssetsId;
  type: AssetsTypes;
};

const assetToLoad = (path: string, type: AssetsTypes): AssetToLoad => ({
  path,
  type,
});

export class CommonAssetsManager {
  private static _Queue = new Map<string, AssetToLoad>();
  private static _VideosMap = new Map<string, HTMLVideoElement>();
  private static _ImagesMap = new Map<string, HTMLImageElement>();
  private static _SoundsMap = new Map<string, HTMLAudioElement>();
  public static Loaded = 0;
  public static OnAssetLoaded = new Action();

  public static AddVideo(videoId: AssetsId, videoPath: string): void {
    this._Queue.set(videoId, assetToLoad(videoPath, AssetsTypes.VIDEO));
  }

  public static AddImage(imageId: AssetsId, imagePath: string): void {
    this._Queue.set(imageId, assetToLoad(imagePath, AssetsTypes.IMAGE));
  }

  public static AddImageWithoutId(imagePath: string): void {
    this._Queue.set(AssetsId.NULL, assetToLoad(imagePath, AssetsTypes.IMAGE));
  }

  public static AddSound(soundId: string, soundPath: string): void {
    this._Queue.set(soundId, assetToLoad(soundPath, AssetsTypes.SOUND));
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
          case AssetsTypes.VIDEO:
            asset = await VideoLoader.Load(path);
            updateLoadedAssetsCount();
            this._VideosMap.set(id, asset);
            break;
          case AssetsTypes.IMAGE:
            asset = await ImageLoader.Load(path);
            updateLoadedAssetsCount();
            this._ImagesMap.set(id, asset);
            break;
          case AssetsTypes.SOUND:
            asset = await SoundLoader.Load(path);
            updateLoadedAssetsCount();
            this._SoundsMap.set(id, asset);
            break;
        }
      }
    );

    await Promise.all(promises);
  }

  public static GetVideo(id: AssetsId): HTMLVideoElement {
    return getOrThrowError(this._VideosMap, id, `No video found for ${id}`)
  }

  public static GetImage(id: AssetsId): HTMLImageElement {
    return getOrThrowError(this._ImagesMap, id, `No image found for ${id}`);
  }

  public static GetSound(id: AssetsId): HTMLAudioElement {
    return getOrThrowError(this._SoundsMap, id, `No sound found for ${id}`);
  }
}
