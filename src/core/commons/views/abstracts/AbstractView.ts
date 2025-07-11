import { ViewId } from '@/core/commons/constants/views/ViewId';
import { ViewLayer } from '@/core/commons/constants/views/ViewLayer';
import type { ViewType } from '@/core/commons/constants/views/ViewType';

export abstract class AbstractView {
  public isView = true;

  constructor(
    public readonly viewId: ViewId,
    public readonly layer: ViewLayer,
    public readonly viewType: ViewType
  ) {}

  /**
   * Called every time the view is displayed using ViewsManager.Show()
   * or ScenesManager.Show() (if declared within a scene).
   *
   * Use this method to add event listeners and perform setup tasks
   * that should run each time the view becomes visible.
   *
   * Note: Prefer adding event listeners here instead of in the constructor.
   */
  public init() {}

  /**
   * Called every time the view is displayed using ViewsManager.Hide()
   * or ScenesManager.Hide() (if declared within a scene).
   *
   * Use this method to clear data, reset UI elements, or remove temporary state
   * so that the view is ready to be shown again.
   *
   * Note: This should not be used for tasks like disposing geometries or materials;
   * use the dedicated destroy method for that.
   */
  public reset() {}

  /**
   * Use this method to clean up resources, such as releasing memory.
   *
   * Note: This method isn't called automatically, but should handle all necessary cleanup to ensure the view
   * can be safely garbage collected.
   */
  public destroy() {}
}