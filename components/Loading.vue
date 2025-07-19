<script setup lang="ts">
import { waapi } from 'animejs';

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
			class="gradient-container h-1 w-200 flex overflow-hidden"
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
	.gradient-container {
		--mask-gradient: linear-gradient(
			to right,
			rgba(1,1,1,0) 0%,
			rgba(1,1,1,1) 20%,
			rgba(1,1,1,1) 50%,
			rgba(1,1,1,1) 80%,
			rgba(1,1,1,0) 100%
		);

		-webkit-mask-image: var(--mask-gradient);
		-webkit-mask-size: 100% 100%;
		-webkit-mask-repeat: no-repeat;
		mask-image: var(--mask-gradient);
		mask-size: 100% 100%;
		mask-repeat: no-repeat;
	}

  .gradient {
    background: linear-gradient(
      to right,
      #101010 20%,
      #FFFFFF 50%,
      #101010 80%,
    );
  }
</style>
