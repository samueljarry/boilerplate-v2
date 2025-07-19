<script setup lang="ts">
  import { SceneId } from '@/core/commons/constants/scenes/SceneId';
  import { ScenesManager } from '@/core/commons/managers/ScenesManager';

  useMainStart(() => {
    ScenesManager.Show(SceneId.DEFAULT);
  });
</script>