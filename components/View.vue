<script setup lang="ts">
  import type { ViewId } from '@/core/commons/constants/views/ViewId';
  import { ViewsManager } from '@/core/commons/managers/ViewsManager';
  import { VueView } from '@/core/commons/views/vue/VueView';

  defineProps<{
    view?: VueView;
  }>();

  const viewRef = ref<HTMLElement>();
  const view = ref<VueView>();
  
  onMounted(() => {
    if(!viewRef.value) return;

    const id = viewRef.value.id as ViewId;
    
    view.value = ViewsManager.Get<VueView>(id);
    view.value.setHtmlElement(viewRef.value);
  });
</script>

<template>
  <div
    ref="viewRef"
    :class="[
      'absolute top-0 left-0',
      'w-svw h-svh'
    ]"
  >
    <slot />
  </div>
</template>