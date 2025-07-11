import { AnimationClip, Camera, Scene } from "three";

import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";

export type PLY = {
  animations: AnimationClip[];
  scene: Scene;
  scenes: Scene[];
  cameras: Camera[];
};

export class PlyLoader {
  private static _Loader = new PLYLoader();

  public static async Load(path: string): Promise<PLY> {
    const promise: PLY = await new Promise((resolve) => {
      this._Loader.load(path, (model) => resolve(model as unknown as PLY));
    });

    return promise;
  }
}
