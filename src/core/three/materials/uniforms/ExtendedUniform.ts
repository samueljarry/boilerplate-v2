import type { Uniform } from "three";

export abstract class ExtendedUniform<U> {
  protected abstract _uniform: Uniform<U>;

  constructor() {
  }

  protected start?(): void;
  protected stop?(): void;

  public get uniform() { return this._uniform; }
}