import { Main } from "@/Main";

export const useMainStart = (callback: () => void) => {
  onMounted(() => {
    Main.OnStart.add(callback);

    if (Main.Started) {
      callback();
    }
  });

  onUnmounted(() => {
    Main.OnStart.remove(callback);
  });
};