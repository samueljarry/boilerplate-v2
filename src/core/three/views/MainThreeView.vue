<script setup lang="ts">
import { Three } from '../Three';

const canvas = ref();

onMounted(() => {
	Three.Canvas = canvas.value;
});
</script>

<template>
	<View>
		<canvas
			ref="canvas"
			class="w-full h-full"
		/>
	</View>
</template>
