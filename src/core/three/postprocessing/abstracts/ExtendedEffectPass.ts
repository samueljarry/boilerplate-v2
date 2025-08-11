import { EffectPass } from "postprocessing";
import { ExtendedEffect } from "./ExtendedEffect";
import type { Effect } from "postprocessing";

export class ExtendedEffectPass extends EffectPass {
  private declare _extendedEffects: Set<ExtendedEffect>;
  
  constructor(...parameters: ConstructorParameters<typeof EffectPass>) {
    super(...parameters);
  }

  protected override setEffects(effects: Effect[]): void {
    super.setEffects(effects);

    this._extendedEffects = new Set();

    for(const effect of effects) {
      if(effect instanceof ExtendedEffect) {
        this._extendedEffects.add(effect)
      }
    }
  }

  public init() {
    for(const extendedEffect of this._extendedEffects) {
      extendedEffect.init();
    }  
  }
  
  public reset() {
    for (const extendedEffect of this._extendedEffects) {
      extendedEffect.reset();
    }  
  }
}