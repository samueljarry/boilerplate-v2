import { Timer, createTimer } from "animejs";

import { Action } from "./Action";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { clamp } from "./clamp";

type UpdateFuncParams = [number, number];
type UpdateFunc = (...params: UpdateFuncParams) => void;

export class Ticker {
  public static readonly FRAMERATE = 120;
  private static _OnUpdate = new Action<UpdateFuncParams>();
  private static _Stats: Stats;
  private static _StatsEnabled = false;
  private static _ElapsedTime = 0;

  private static _Timer = createTimer({
    loop: true,
    frameRate: this.FRAMERATE,
  }).pause();

  public static Start(): void {
    this._Timer.onUpdate = this._Render;
    this._Timer.play();
  }

  public static EnableStats() {
    if (!this._Stats) {
      this._Stats = new Stats();
    }

    document.body.appendChild(this._Stats.dom);
    this._StatsEnabled = true;
  }

  public static Stop(): void {
    this._Timer.pause();
  }

  public static Add(func: UpdateFunc): void {
    this._OnUpdate.add(func);
  }

  public static Remove(func: UpdateFunc): void {
    this._OnUpdate.remove(func);
  }

  public static Has(func: UpdateFunc) {
    return this._OnUpdate.actionSet.has(func);
  }

  private static _Render = ({ deltaTime, currentTime }: Timer): void => {
    const dt = clamp(deltaTime / 1000);
    this._ElapsedTime = currentTime / 1000;

    this._OnUpdate.execute(dt, this._ElapsedTime);

    if (this._StatsEnabled) this._Stats.update();
  };

  public static get ElapsedTime() {
    return this._ElapsedTime;
  }
}
