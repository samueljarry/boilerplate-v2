import { AbstractAnimatedView } from "../views/abstracts/AbstractAnimatedView";
import type { AbstractView } from "../views/abstracts/AbstractView";
import { Action } from "../utils/Action";
import type { Component } from "vue";
import { ThreeView } from "@/core/three/views/ThreeView";
import { ViewId } from "../constants/views/ViewId";
import { ViewLayer } from "../constants/views/ViewLayer";
import { ViewType } from "../constants/views/ViewType";
import { VueView } from "../views/vue/VueView";
import { getOrThrowError } from "../utils/getOrThrow";

export class ViewsManager {
  private static _ViewsMap = new Map<ViewId, AbstractView>();

  private static _DisplayedVueViewsMap = new Map<ViewLayer, VueView>();
  private static _DisplayedThreeViewsMap = new Map<ViewLayer, ThreeView>();
  private static _DisplayedViews = new Set<ViewId>();
  private static _DisplayedViewsFromType = new Map<
    ViewType,
    Map<ViewLayer, AbstractView>
  >();

  static {
    this._DisplayedViewsFromType.set(ViewType.VUE, this._DisplayedVueViewsMap);
    this._DisplayedViewsFromType.set(ViewType.THREE, this._DisplayedThreeViewsMap);
  }

  public static OnViewsChange = new Action();

  // #region View creations

  /**
   * Creates a new Vue-based view and registers it in the views map.
   *
   * Use this method to instantiate a VueView with the specified ID, Vue component, and layer.
   * The view will be available for display and management by the ViewsManager.
   *
   * @param id - The unique identifier for the view.
   * @param component - The Vue component to associate with the view.
   * @param layer - The layer (z-index) on which the view should be displayed.
   */
  public static CreateVueView(
    id: ViewId,
    component: Component,
    layer: ViewLayer
  ): void {
    const view = new VueView(id, component, layer);
    this._ViewsMap.set(id, view);
  }

  /**
   * Creates a new Three.js-based view and registers it in the views map.
   *
   * Use this method to instantiate a ThreeView by providing its class constructor.
   * The view will be available for display and management by the ViewsManager.
   *
   * @param view - The ThreeView class (constructor) to instantiate and register.
   */
  public static CreateThreeView(view: new () => ThreeView): void {
    const v = new view();
    this._ViewsMap.set(v.viewId, v);
  }
  // #endregion

  // #region utilities

  /**
   * Displays the view corresponding to the given view ID.
   *
   * If another view is already displayed on the same layer, it will be hidden first.
   * If the previous view or the new view is animated, the appropriate intro/outro
   * animations and transitions will be handled.
   *
   * @param id - The unique identifier of the view to display.
   *
   * Note: This method manages view visibility per layer and ensures proper
   * animation lifecycle. If the previous view is animated, the new view will
   * be shown only after the outro animation completes.
   */
  public static Show(id: ViewId): void {
    const view = this.Get(id);
    const isAnimated = this._IsViewAnimated(view);

    const layerViewMap = this._GetDisplayedViewMapFromType(view.viewType);

    const prevView = layerViewMap.get(view.layer);

    const hadViewAtSameLayer = !!prevView;
    const prevViewIsAnimated =
      hadViewAtSameLayer && this._IsViewAnimated(prevView);

    const showView = () => {
      if (prevViewIsAnimated) {
        prevView.onOutroComplete.remove(showView);
      }

      layerViewMap.set(view.layer, view);
      this._DisplayedViews.add(id);

      view.init();

      this.OnViewsChange.execute();

      if (isAnimated) {
        view.intro();
      }
    };

    if (hadViewAtSameLayer && prevViewIsAnimated) {
      prevView.onOutroComplete.add(showView);
      prevView.outro();
    } else if (hadViewAtSameLayer) {
      this.Hide(prevView.viewId);
      showView();
    } else {
      showView();
    }
  }

  /**
   * Hides the view corresponding to the given view ID.
   *
   * If the view is animated, its outro animation will be played before it is removed
   * from the displayed views and layer mapping. The removal and updates are performed
   * after the outro animation completes.
   *
   * @param id - The unique identifier of the view to hide.
   */
  public static Hide(id: ViewId): void {
    const view = this.Get(id);
    const isAnimated = this._IsViewAnimated(view);

    const displayedViewMap = this._GetDisplayedViewMapFromType(view.viewType);

    const afterOutro = () => {
      if (isAnimated) view.onOutroComplete.remove(afterOutro);

      displayedViewMap.delete(view.layer);
      this._DisplayedViews.delete(id);
      this.OnViewsChange.execute();
    };

    if (isAnimated) {
      view.onOutroComplete.add(afterOutro);
      view.outro();
    } else {
      view.reset();
      afterOutro();
    }
  }
  // #endregion

  // #region getters
  private static _IsViewAnimated(view: AbstractView) {
    const isThreeView = view instanceof ThreeView;
    const isAnimated = view instanceof AbstractAnimatedView;

    return isThreeView || isAnimated;
  }

  /**
   * Retrieves the map of displayed views corresponding to the given view type.
   *
   * @param type - The type of view (e.g., VUE, THREE) whose displayed views map should be retrieved.
   * @returns The map associating view layers with their displayed views for the specified type.
   */
  private static _GetDisplayedViewMapFromType(type: ViewType) {
    const viewMap = this._DisplayedViewsFromType.get(type);

    if (!viewMap) {
      throw new Error(`
        No DisplayedView map found for type: ${type}.
        Please, make sure to declare it inside _DisplayedViewsFromType.
      `);
    }

    return viewMap;
  }

  /**
   * Retrieves the view instance associated with the given view ID.
   */
  public static Get<T = AbstractView>(id: ViewId): T {
    return getOrThrowError(this._ViewsMap, id, `No view found for "${id}"`) as T;
  }

  public static IsDisplayed(id: ViewId) {
    return this._DisplayedViews.has(id);
  }

  public static get DisplayedViews() {
    return this._DisplayedViews;
  }
  public static get DisplayedVueViews() {
    return this._DisplayedVueViewsMap.values();
  }
  public static get DisplayedThreeViews() {
    return new Set(this._DisplayedThreeViewsMap.values());
  }
  // #endregion
}