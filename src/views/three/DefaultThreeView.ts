import { DemoObject } from "@/components/three/DemoObject";
import { ThreeView } from "@/core/three/views/ThreeView";
import { ViewId } from "@/core/commons/constants/views/ViewId";
import { ViewLayer } from "@/core/commons/constants/views/ViewLayer";

export class DemoThreeView extends ThreeView {
  constructor() {
    super(ViewId.THREE_DEMO, ViewLayer.MAIN)

    this.add(new DemoObject);
  }
}