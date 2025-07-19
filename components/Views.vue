<script setup lang="ts">
  import { ViewsManager } from '@/core/commons/managers/ViewsManager';
  import type { VueView } from '@/core/commons/views/vue/VueView';
  import { Main } from '@/Main';

  const views = shallowRef<VueView[]>();
  const loading = ref(true);
  
  const setDisplayedViews = () => {
    views.value = Array.from(ViewsManager.DisplayedVueViews)
  }

  const onAfterInit = () => {
    loading.value = false;
    
    Main.Start();
  }

  onMounted(() => {
    Main.Init()
    
    Main.OnAfterInit.add(onAfterInit);
    ViewsManager.OnViewsChange.add(setDisplayedViews);
  });

  onUnmounted(() => {
    ViewsManager.OnViewsChange.remove(setDisplayedViews);
    Main.OnAfterInit.remove(onAfterInit);
  });
</script>

<template>
  <Loading 
    v-if="loading"
  />
  
  <component
    v-for="view in views"
    :is="view.component"
    :key="view.viewId"
    :id="view.viewId"
    :view="view"
  />
</template>