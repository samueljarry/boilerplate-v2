import { NearestFilter, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader as ThreeTextureLoader } from "three";

export class TextureLoader {
  private static _Loader = new ThreeTextureLoader();

  public static async Load(path: string): Promise<Texture> {
    const texture = await this._Loader.loadAsync(path);

    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;

    return texture;
  }
}
