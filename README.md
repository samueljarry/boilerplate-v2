# Nuxt Three.js Boilerplate

A minimal Nuxt.js and TypeScript boilerplate with integrated Three.js support.

It features a **Custom View System** for managing both Three.js and Vue views, designed for easy extension to other technologies.
A custom **CLI** is also provided to automate file creation, streamlining project structure alongside asset loading and view initialization.





# Table of contents

1. **[InitCommand](#initcommand)**
    - [Registering InitCommand](#registering-initcommand)
    - [Loading assets](#loading-assets)
    - [Retrieving assets](#retrieving-assets)
2. **[Views](#views)**
    - [Vue](#vue-view)
    - [Three.js](#threejs-view)
    - [Registering views](#registering-views)
    - [Show/hide views](#showhide-views)
3. **[Scenes](#scenes)**
    - [Scene](#scene)
    - [ThreeScene](#threescene)
    - [Registering scene](#registering-scene)
    - [Show/hide scene](#showhide-scene)
4. **[CameraController](#cameracontroller)**
    - [Creating a Camera Controller](#creating-a-camera-controller)
    - [Built-in Camera Controllers](#built-in-camera-controllers)
    - [Registering Camera Controllers](#registering-camera-controllers)
    - [Using Camera Controllers](#using-camera-controllers)
    - [Camera Controller Lifecycle](#camera-controller-lifecycle)
5. **[CLI](#cli)**
    - [Getting Started](#getting-started)
    - [Available Generators](#available-generators)


## InitCommand
An InitCommand is responsible for loading assets and initializing other classes, such as managers, views, or scenes.

A project can include multiple InitCommands—typically, one per Scene—to ensure each Scene has its own dedicated assets and views, organized appropriately.



### Registering InitCommand
To register an InitCommand in the loading pipeline, just add its class to the `⁠Inits` array in [Main.ts]('./Main.ts'):
```ts
public static readonly Inits = [
  CoreInitCommand,
  GlobalInitCommand,
] as const;
```
> **Note:**  
> `CoreInitCommand` must **ALWAYS** remain in the array, as it handles loading internal scripts required for the boilerplate to function properly.



### Loading assets
This boilerplate provides two asset managers:

-	**CommonAssetsManager:** Handles loading of standard assets such as images, audio, and video files.
-	**ThreeAssetsManager:** Supports loading of Three.js-specific assets, including Texture, GLTF/GLB, CubeTexture, HDR, and PLY formats.

Each asset must be assigned a unique identifier, typically defined in the [AssetsId](./core/commons/constants/AssetsId.ts) file.

Here’s an example of how to load your assets:
```ts
// GlobalInitCommand.ts

public override async initCommons() {
  CommonAssetsManager.AddSound(AssetsId.SOUND_FOO, 'path-from-public/sounds/foo.mp3');
}

public override async initThree() {
  ThreeAssetsManager.AddTexture(AssetsId.TEXTURE_BAR, 'path-from-public/textures/bar.mp3');
}
```



### Retrieving assets
Once all assets are loaded, you can access them from anywhere in your project as follows:

```ts
const sound = CommonAssetsManager.GetSound(AssetsId.SOUND_FOO);
const texture = ThreeAssetsManager.GetTexture(AssetsId.TEXTURE_BAR);
```




## Views
A view is similar to a component, but it is integrated with the custom display system, allowing you to display it from anywhere in the project.
No matter which technology is used, the display logic remains unified.

Each view consists of a unique identifier and a layer, which are defined in the [ViewId]('./core/commons/constants/views/ViewId.ts') and [ViewLayer]('./core/commons/constants/views/ViewLayer.ts') files, respectively. For Vue components, the layer value acts as a z-index.

If two views of the same type share the same layer, the most recently added one will override and hide the previous.

### Vue View

To create a Vue View, start by adding a `⁠.vue` file in the [views/vue/](./views/vue/) folder. It’s recommended to follow a naming convention for Vue View files, such as ⁠`FooVueView.vue`.

Inside the ⁠.vue file, simply place the `⁠View` component within the `⁠<template>`.
The import is handled automatically.

**FooVueView.vue file**
```vue
<template>
  <View>
    
  </View>
</template>
```

### Three.js View
To create a Three View, start by creating a `.ts` file in the [views/three/](./views/three/) folder. It’s recommended to follow a naming convention for Three View files, such as ⁠`BarThreeView.vue`.

Inside your class file, simply extend ⁠ThreeView and provide the required ⁠ViewId and ⁠ViewLayer in the constructor.

**Three View Class**
```ts
import { ThreeView } from "@/core/three/views/ThreeView";
import { ViewLayer } from "@/core/commons/constants/views/ViewLayer";
import { ViewId } from "@/core/commons/constants/views/ViewId";

export class BarThreeView extends ThreeView {
  constructor() {
    super(ViewId.THREE_BAR, ViewLayer.IDK);
  }

  public override init() {
    super.init();
  }

  public override reset() {
    super.reset();
  }
}
```
> The ⁠init method is called each time a Three View is added to the scene, while the ⁠reset method is triggered whenever it is removed. You will typically use these methods to add event listeners or perform cleanup tasks.

### Registering views
Once you've created your views, they must be registered in the system before they can be displayed. View registration is handled in the `initViews()` method of your InitCommand classes.

**For Vue Views:**
```ts
// In your InitCommand class (e.g., GlobalInitCommand.ts)
public override initViews() {
  ViewsManager.CreateVueView(
    ViewId.FOO,           // Unique identifier
    FooVueView,           // Vue component
    ViewLayer.UI_1        // Display layer
  );
}
```

**For Three Views:**
```ts
// In your InitCommand class (e.g., GlobalInitCommand.ts)  
public override initViews() {
  ViewsManager.CreateThreeView(BarThreeView); // Three view class
}
```

**Complete example:**
```ts
// GlobalInitCommand.ts
import { ViewsManager } from "@/core/commons/managers/ViewsManager";
import { ViewId } from "@/core/commons/constants/views/ViewId";
import { ViewLayer } from "@/core/commons/constants/views/ViewLayer";
import FooVueView from "@/views/vue/FooVueView.vue";
import { BarThreeView } from "@/views/three/BarThreeView";

export class GlobalInitCommand extends InitCommand {
  public override initViews() {
    // Register Vue views
    ViewsManager.CreateVueView(ViewId.FOO, FooVueView, ViewLayer.UI_1);
    
    // Register Three views  
    ViewsManager.CreateThreeView(BarThreeView);
  }
}
```

> **Important:** Don't forget to add the corresponding ViewId entries in the [ViewId]('./core/commons/constants/views/ViewId.ts') enum and ViewLayer entries in the [ViewLayer]('./core/commons/constants/views/ViewLayer.ts') enum before registering your views.

### Show/hide views
Once views are registered, you can display or hide them from anywhere in your project using the ViewsManager.

**Show a view:**
```ts
ViewsManager.Show(ViewId.FOO);
```

**Hide a view:**
```ts
ViewsManager.Hide(ViewId.FOO);
```


**Example usage:**
```ts
// Show a Vue view
ViewsManager.Show(ViewId.DEMO);

// Show a Three.js view
ViewsManager.Show(ViewId.THREE_DEMO);

// Hide views when no longer needed
ViewsManager.Hide(ViewId.DEMO);
ViewsManager.Hide(ViewId.THREE_DEMO);
```

> **Note:** When showing a view on a layer that already has another view displayed, the previous view will be automatically hidden. Views support animations, so intro/outro transitions will be handled automatically if the view extends `AbstractAnimatedView`.




## Scenes
A scene is a container that manages a collection of views and their lifecycle. Scenes provide a way to organize your application into different states or sections, each with its own set of views and logic.

Each scene has a unique identifier, a layer for z-index management, and a type that determines its behavior. Scenes can automatically show and hide their associated views when activated or deactivated.

### Scene
The base `AbstractScene` class provides the foundation for all scenes. It manages three types of view collections:

- **`_views`**: Views that are shown/hidden together with the scene
- **`_linkedViews`**: Views that are hidden when the scene is hidden, but not automatically shown
- **`_persistentViews`**: Views that are shown with the scene but remain visible when the scene is hidden

**Basic Scene Example:**
```ts
import { AbstractScene } from "@/core/commons/scenes/AbstractScene";
import { SceneId } from "@/core/commons/constants/scenes/SceneId";
import { SceneLayer } from "@/core/commons/constants/scenes/SceneLayer";
import { SceneType } from "@/core/commons/constants/scenes/SceneType";
import { ViewId } from "@/core/commons/constants/views/ViewId";

export class CustomScene extends AbstractScene {
  constructor() {
    super(SceneId.CUSTOM, SceneLayer.MAIN, SceneType.COMMON);

    // Views shown/hidden with the scene
    this._views.add(ViewId.DEMO);
    
    // Views that persist when scene is hidden
    this._persistentViews.add(ViewId.UI_HEADER);
    
    // Views only hidden with the scene
    this._linkedViews.add(ViewId.MODAL);
  }

  public override init(): void {
    super.init();
    // Custom initialization logic
  }

  public override reset(): void {
    super.reset();
    // Custom cleanup logic
  }
}
```

### ThreeScene
`ThreeScene` extends `AbstractScene` and is specifically designed for Three.js-based scenes. It provides additional functionality for managing HDR environments and camera controllers.

**ThreeScene Features:**
- Automatic HDR environment setup
- Camera controller management
- Three.js-specific initialization

**ThreeScene Example:**
```ts
import { ThreeScene } from "@/core/three/scenes/ThreeScene";
import { SceneId } from "@/core/commons/constants/scenes/SceneId";
import { SceneLayer } from "@/core/commons/constants/scenes/SceneLayer";
import { AssetsId } from "@/core/commons/constants/AssetsId";
import { CamerasId } from "@/core/three/constants/CamerasId";
import { ViewId } from "@/core/commons/constants/views/ViewId";

export class DemoScene extends ThreeScene {
  constructor() {
    super(SceneId.DEMO, SceneLayer.MAIN, {
      hdr: AssetsId.HDR_SKY,        // HDR environment
      camera: CamerasId.DEFAULT     // Camera controller
    });

    // Add Three.js and Vue views
    this._views.add(ViewId.THREE_DEMO);
    this._views.add(ViewId.DEMO);
  }

  public override init(): void {
    super.init();
    // Custom Three.js scene setup
  }
}
```

### Registering scene
Scenes must be registered in the system before they can be displayed. Scene registration is handled in the `initScenes()` method of your InitCommand classes.

```ts
// In your InitCommand class (e.g., GlobalInitCommand.ts)
import { ScenesManager } from "@/core/commons/managers/ScenesManager";
import { DemoScene } from "@/scenes/DemoScene";

export class GlobalInitCommand extends InitCommand {
  public override initScenes() {
    ScenesManager.Add(DemoScene);
  }
}
```

> **Important:** Don't forget to add the corresponding SceneId entries in the [SceneId]('./core/commons/constants/scenes/SceneId.ts') enum and SceneLayer entries in the [SceneLayer]('./core/commons/constants/scenes/SceneLayer.ts') enum before registering your scenes.

### Show/hide scene
Once scenes are registered, you can display or hide them from anywhere in your project using the ScenesManager.

**Show a scene:**
```ts
ScenesManager.Show(SceneId.DEMO);
```

**Hide a scene:**
```ts
ScenesManager.Hide(SceneId.DEMO);
```

**Example usage:**
```ts
// Show the demo scene (will hide any other scene on the same layer)
ScenesManager.Show(SceneId.DEMO);

// Later, switch to another scene
ScenesManager.Show(SceneId.MENU);

// Hide the current scene
ScenesManager.Hide(SceneId.MENU);
```

> **Note:** When showing a scene on a layer that already has another scene displayed, the previous scene will be automatically hidden first. This ensures only one scene per layer is active at any time.




## CameraController
Camera controllers manage the camera behavior and interactions in Three.js scenes. They provide a unified system for handling different camera types (perspective, orthographic) and control schemes (orbit, FPS, etc.).

Each camera controller has a unique identifier and extends the `AbstractCameraController` class, which handles the camera lifecycle, canvas integration, and resize events automatically.

### Creating a Camera Controller
Camera controllers are created by extending either `PerspectiveCameraController` or `OrthographicCameraController` based on your needs.

**Perspective Camera Controller Example:**
```ts
import { CamerasId } from "@/core/three/constants/CamerasId";
import { PerspectiveCameraController } from "@/core/three/controllers/cameras/abstracts/PerspectiveCameraController";

export class DefaultCameraController extends PerspectiveCameraController {
  constructor() {
    super(CamerasId.DEFAULT);

    // Set initial camera position
    this.position.set(0, 0, 5);
  }

  public override init(): void {
    super.init();
    // Custom initialization (event listeners, etc.)
  }

  public override reset(): void {
    super.reset();
    // Custom cleanup
  }
}
```

**Orthographic Camera Controller Example:**
```ts
import { CamerasId } from "@/core/three/constants/CamerasId";
import { OrthographicCameraController } from "@/core/three/controllers/cameras/abstracts/OrthographicCameraController";

export class OrthoCameraController extends OrthographicCameraController {
  constructor() {
    super(CamerasId.ORTHO);

    this.position.set(0, 0, 10);
  }
}
```

### Built-in Camera Controllers
The boilerplate includes several pre-built camera controllers:

- **`OrbitCameraController`**: Mouse-controlled orbital camera with zoom and pan
- **`FPSCameraController`**: First-person shooter style camera with keyboard/mouse controls
- **`KeyboardCameraController`**: Keyboard-only camera movement

**Debug Camera Controls:**
The system includes built-in debug controls for quick camera switching during development:

- **`Shift + C`**: Switch to/from Orbit camera
- **`Shift + F`**: Switch to/from FPS camera

These shortcuts allow you to quickly test different camera angles and controls without modifying code.

### Registering Camera Controllers
Camera controllers must be registered in the `initThree()` method of your InitCommand classes.

```ts
// In your InitCommand class (e.g., CoreInitCommand.ts)
import { CamerasManager } from "@/core/three/managers/CamerasManager";
import { DefaultCameraController } from "@/controllers/cameras/DefaultCameraController";
import { OrbitCameraController } from "@/core/three/controllers/cameras/OrbitCameraController";

export class CoreInitCommand extends InitCommand {
  public override async initThree(): Promise<void> {
    // Register camera controllers
    CamerasManager.Add(DefaultCameraController);
    CamerasManager.Add(OrbitCameraController);
  }
}
```

### Using Camera Controllers
Once registered, camera controllers can be activated and managed through the CamerasManager.

**Set active camera controller:**
```ts
// By ID
CamerasManager.Controller = CamerasId.DEFAULT;

// By instance
const camera = CamerasManager.Get(CamerasId.ORBIT);
CamerasManager.Controller = camera;
```

**Get camera controller:**
```ts
const defaultCamera = CamerasManager.Get<DefaultCameraController>(CamerasId.DEFAULT);
```

**Camera controller events:**
```ts
// Listen for camera changes
CamerasManager.OnCameraChange.add((controller) => {
  console.log('Camera changed to:', controller.cameraId);
});

// Listen for first camera initialization
CamerasManager.OnFirstCameraSet.add(() => {
  console.log('First camera has been set');
});
```

### Camera Controller Lifecycle
Camera controllers follow a specific lifecycle:

1. **Construction**: Camera is created and added to the controller
2. **Registration**: Controller is added to CamerasManager
3. **Activation**: Controller becomes active via `CamerasManager.Controller`
4. **Init**: `init()` method is called, resize listeners are added
5. **Reset**: `reset()` method is called when controller becomes inactive

> **Important:** Don't forget to add the corresponding CamerasId entries in the [CamerasId]('./core/three/constants/CamerasId.ts') enum before registering your camera controllers.




## CLI
The boilerplate includes a CLI that automates file creation and project structure management. It streamlines the development process by generating boilerplate code for views, scenes, camera controllers, and other components.

### Getting Started
The CLI is accessible through the `npm run gen` command, which launches an interactive prompt to guide you through the generation process.

```bash
npm run gen
```

This command will present you with a menu of available generation options and walk you through the configuration process for each type of component.

### Available Generators
The CLI provides generators for the most common project components:

**View Generators:**
- **Vue View Generator**: Creates new Vue components with proper View wrapper and registration
- **Three View Generator**: Creates new Three.js view classes with proper inheritance and lifecycle methods

**Scene Generators:**
- **Scene Generator**: Creates basic scene classes extending AbstractScene
- **Three Scene Generator**: Creates Three.js-specific scenes with HDR and camera support

**Camera Controller Generator:**
- **Camera Controller Generator**: Creates new camera controller classes with proper inheritance and configuration

**Other Generators:**
- **InitCommand Generator**: Creates new InitCommand classes for organizing initialization logic