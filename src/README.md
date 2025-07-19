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
5. **[CLI](#cli)**






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