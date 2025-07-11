import { AbstractScene } from "./AbstractScene";
import type { SceneId } from "../constants/scenes/SceneId";
import type { SceneLayer } from "../constants/scenes/SceneLayer";
import { SceneType } from "../constants/scenes/SceneType";

export class Scene extends AbstractScene {
  constructor(id: SceneId, layer: SceneLayer) {
    super(id, layer, SceneType.VANILLA);
  }
}