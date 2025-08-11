import type { ExtendedEffectPass } from "../abstracts/ExtendedEffectPass";
import type { Pass } from "postprocessing";
import type { PassId } from "../constants/PassId";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";

export class PostProcessingProxy {
  private static _PassesMap = new Map<PassId, ExtendedEffectPass>();

  public static AddPass(id: PassId, pass: ExtendedEffectPass) {
    this._PassesMap.set(id, pass);
  }

  public static RemovePass(id: PassId) {
    this._PassesMap.delete(id);
  }

  public static GetPass(id: PassId) {
    return getOrThrowError(this._PassesMap, id);
  }

  public static get Passes() {
    return this._PassesMap.entries();
  }
}