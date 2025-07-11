<script setup lang="ts">
  import { ViewsManager } from '@/core/commons/managers/ViewsManager';
  import type { VueView } from '@/core/commons/views/vue/VueView';
  import { Main } from '@/Main';

  const views = shallowRef<VueView[]>();
  const loading = ref(true);
  
  const setDisplayedViews = () => {
    views.value = Array.from(ViewsManager.DisplayedVueViews)
  }

  const onInit = () => {
    loading.value = false;
    
    Main.Start();
  }

  onMounted(() => {
    Main.Init()
    
    Main.OnInit.add(onInit);
    ViewsManager.OnViewsChange.add(setDisplayedViews);
  });

  onUnmounted(() => {
    ViewsManager.OnViewsChange.remove(setDisplayedViews);
    Main.OnInit.remove(onInit);
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