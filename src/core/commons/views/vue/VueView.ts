import { AbstractView } from "../abstracts/AbstractView";
import type { Component } from "vue";
import type { ViewId } from "../../constants/views/ViewId";
import { ViewLayer } from "../../constants/views/ViewLayer";
import { ViewType } from "../../constants/views/ViewType";

export class VueView extends AbstractView {
  private _component: Component;
  private _props = {};
  private _htmlElement: HTMLElement;

  constructor(id: ViewId, component: Component, layer: ViewLayer) {
    super(id, layer, ViewType.VUE);

    this._component = component;
    this._props = {
      id,
    };
  }

  public setHtmlElement(htmlElement: HTMLElement): void {
    this._htmlElement = htmlElement;

    if (this.layer === ViewLayer.NULL) return;

    this._htmlElement.style.zIndex = this.layer.toString();
  }

  public get component() {
    return this._component;
  }
  public get props() {
    return this._props;
  }
  public get htmlElement() {
    return this._htmlElement;
  }
}