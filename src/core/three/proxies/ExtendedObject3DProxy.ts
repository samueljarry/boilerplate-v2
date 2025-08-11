import type { ExtendedObject3D } from "../components/ExtendedObject3D";
import type { ExtendedObject3DId } from "../constants/ExtendedObject3DId";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";

export class ExtendedObject3DProxy {
  private static _ExtendedObject3DMap = new Map<ExtendedObject3DId, ExtendedObject3D>();

  public static Add(id: ExtendedObject3DId, obj3d: ExtendedObject3D) {
    this._ExtendedObject3DMap.set(id, obj3d);
  }

  public static Remove(id: ExtendedObject3DId) {
    this._ExtendedObject3DMap.delete(id);
  }

  public static Get<T extends ExtendedObject3D>(id: ExtendedObject3DId) {
    return getOrThrowError(this._ExtendedObject3DMap, id) as T;
  }

  public static get ExtendedObject3Ds() {
    return this._ExtendedObject3DMap.entries();
  }
}
