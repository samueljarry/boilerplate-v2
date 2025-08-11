import { ShaderChunk } from "three";
import { gamma2_2 } from "../materials/chunks/gamma2_2.glsl";
import { map } from "../materials/chunks/map.glsl";
import { rotate2d } from "../materials/chunks/rotate_2d.glsl";
import { uvCover } from "../materials/chunks/uv_cover.glsl";
import { worldPosition } from "../materials/chunks/world_position.glsl";

type AdditionalChunksRecord = Record<typeof CustomChunks[number][0], string>; 
type ExtendedShaderChunk = typeof ShaderChunk & AdditionalChunksRecord; 

const ExtendedShaderChunk = ShaderChunk as ExtendedShaderChunk;;
const CustomChunks = [
  ["rotate_2d", rotate2d],
  ["map", map],
  ["uv_cover", uvCover],
  ["gamma2_2", gamma2_2],
  ["world_position", worldPosition],
] as const;

export class ShaderChunkCommand {
  public static Extend() {
    this._AddCustomChunks();
  }

  private static _AddCustomChunks() {
    const c = ExtendedShaderChunk;
    
    for(const [chunkName, chunk] of CustomChunks) {
      c[chunkName] = chunk;
    }
  }
}