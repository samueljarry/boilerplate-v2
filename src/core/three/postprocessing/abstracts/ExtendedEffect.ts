import { Effect } from "postprocessing";

export class ExtendedEffect extends Effect {
  constructor(...params: ConstructorParameters<typeof Effect>) {
    super(...params);
  }

  public init() {}

  public reset() {}
}