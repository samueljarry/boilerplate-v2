<script setup lang="ts">
import { waapi } from 'animejs';

const gradient = ref();

onMounted(() => {
	waapi.animate('.gradient', {
		x: '100%',
		loop: true,
		ease: 'none',
	}).play();
});
</script>

<template>
	<div class="w-svw h-svh bg-nearBlack flex flex-col items-center justify-center">
		<div
			class="h-1 w-200 flex overflow-hidden"
		>
			<div class="w-fit h-1 flex -translate-x-1/2">
				<div
					class="gradient w-200 h-full"
				/>
				<div
					class="gradient w-200 h-full"
				/>
			</div>
		</div>
		<span class="text-white relative top-15">
			initializing.
		</span>
	</div>
</template>

<style scoped lang="scss">
  .gradient {
    background: linear-gradient(
      to right,
      #2c2c2c 12.5%,
      white 50%,
      #2c2c2c 87.5%,
    );
  }
</style>
