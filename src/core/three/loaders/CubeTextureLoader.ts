import { CubeTexture, CubeTextureLoader as ThreeCubeTextureLoader } from "three";

export class CubeTextureLoader {
  private static _Loader = new ThreeCubeTextureLoader();

  public static async Load(path: string): Promise<CubeTexture> {
    const promise = new Promise<CubeTexture>((resolve) => {
      this._Loader
        .setPath(path)
        .load(
          [
            "px.png", 
            "nx.png", 
            "py.png", 
            "ny.png", 
            "pz.png", 
            "nz.png"
          ],
          resolve
        );
    });

    return promise;
  }
}
