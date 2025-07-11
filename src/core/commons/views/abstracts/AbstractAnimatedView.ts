import { AbstractView } from "./AbstractView";
import { ViewId } from "../../constants/views/ViewId";
import type { ViewLayer } from "../../constants/views/ViewLayer";
import type { ViewType } from "../../constants/views/ViewType";
import { Action } from "../../utils/Action";

export class AbstractAnimatedView extends AbstractView {
  public isAnimatedView = true;
  public onOutroComplete = new Action();

  constructor(id: ViewId, layer: ViewLayer, type: ViewType) {
    super(id, layer, type);
  }

  /**
   * Called immediately after init(), when the view is shown.
   *
   * Use this method to start all intro animations and transitions
   * that should play when the view becomes visible.
   *
   * Note: Place only animation-related logic here; other setup
   * tasks should remain in init().
   */
  public intro(): void {}

  public override reset(): void {
    super.reset();
    this.onOutroComplete.execute();
  }

  /**
   * Called just before reset(), when the view is about to be hidden.
   *
   * Use this method to start all outro animations and transitions
   * that should play before the view becomes invisible.
   *
   * Note: Place only animation-related logic here; other reset
   * tasks should remain in reset().
   *
   * Important: Always call super.outro() at the end of your outro
   * animation or transition, to ensure the view lifecycle proceeds correctly.
   */
  public outro() {
    this.reset();
  }
}