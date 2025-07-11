import { AssetsId } from "@/core/commons/constants/AssetsId";
import { ThreeAssetsType } from "../constants/ThreeAssetsType";
import type { CubeTexture, Texture } from "three";
import type { DataTexture } from "three";
import { GLBLoader, type GLB } from "../loaders/GLBLoader";
import { TextureLoader } from "../loaders/TextureLoader";
import { PlyLoader } from "../loaders/PLYLoader";
import { HdrLoader } from "../loaders/HdrLoader";
import { CubeTextureLoader } from "../loaders/CubeTextureLoader";
import { Action } from "@/core/commons/utils/Action";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";

type ThreeQueuedAsset = {
  path: string;
  type: ThreeAssetsType;
};

const createQueuedAssetObject = (
  path: string,
  type: ThreeAssetsType
): ThreeQueuedAsset => ({
  path,
  type,
});

export class ThreeAssetsManager {
  public static OnLoad = new Action<[AssetsId, unknown]>();

  private static _Queue = new Map<AssetsId, ThreeQueuedAsset>();
  private static _TexturesMap = new Map<AssetsId, Texture>();
  private static _ModelsMap = new Map<AssetsId, GLB>();
  private static _HdrMap = new Map<AssetsId, DataTexture>();
  private static _CubeTexturesMap = new Map<AssetsId, CubeTexture>();

  // #region utilities
  // #region Queue Assets
  private static _AddToQueue(id: AssetsId, path: string, type: ThreeAssetsType) {
    this._Queue.set(id, createQueuedAssetObject(this._GetPath(path), type));
  }

  public static AddTexture(id: AssetsId, path: string): void {
    this._AddToQueue(id, path, ThreeAssetsType.TEXTURE);
  }

  public static AddGlb(id: AssetsId, path: string): void {
    this._AddToQueue(id, path, ThreeAssetsType.GLB);
  }

  public static AddPly(id: AssetsId, path: string): void {
    this._AddToQueue(id, path, ThreeAssetsType.PLY);
  }

  public static AddHdr(id: AssetsId, path: string): void {
    this._AddToQueue(id, path, ThreeAssetsType.HDR);
  }

  public static AddCubeTexture(id: AssetsId, path: string): void {
    this._AddToQueue(id, path, ThreeAssetsType.CUBEMAP);
  }
  // #endregion

  public static async Load(): Promise<void> {
    const promises = Array.from(this._Queue.entries()).map(
      async ([id, { type, path }]) => {
        let asset = undefined;

        switch (type) {
          case ThreeAssetsType.TEXTURE:
            asset = await TextureLoader.Load(path);
            this._TexturesMap.set(id, asset);
            break;
          case ThreeAssetsType.GLB:
            asset = await GLBLoader.Load(path);
            this._ModelsMap.set(id, asset);
            break;
          case ThreeAssetsType.PLY:
            asset = await PlyLoader.Load(path);
            this._ModelsMap.set(id, asset);
            break;
          case ThreeAssetsType.HDR:
            asset = await HdrLoader.Load(path);
            this._HdrMap.set(id, asset);
            break;
          case ThreeAssetsType.CUBEMAP:
            asset = await CubeTextureLoader.Load(path);
            this._CubeTexturesMap.set(id, asset);
            break;
        }

        this._Queue.delete(id);
        this.OnLoad.execute(id, asset);
      }
    );

    await Promise.all(promises);
  }

  private static _Retrieve<T>(map: Map<AssetsId, T>, id: AssetsId): T {
    return getOrThrowError(
      map,
      id,
      `
        The Three.js asset with ID ⁠${id} could not be found.
        Make sure it has been added to the loading queue in an ⁠InitCommand 
        and that you are not trying to retrieve it before loading is complete.
      `
    );
  }

  private static _GetPath(path: string) {
    return '/' + path;
  }
  // #endregion

  // #region getters / setters
  public static GetTexture(id: AssetsId) {
    return this._Retrieve(this._TexturesMap, id);
  }

  public static GetModel(id: AssetsId) {
    return this._Retrieve(this._ModelsMap, id);
  }

  public static GetCubeTexture(id: AssetsId) {
    return this._Retrieve(this._CubeTexturesMap, id);
  }

  public static GetHdr(id: AssetsId) {
    return this._Retrieve(this._HdrMap, id);
  }

  public static get Queue(): typeof this._Queue {
    return this._Queue;
  }
  // #endregion
}