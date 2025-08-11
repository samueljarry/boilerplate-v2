export class SoundLoader {
  public static async Load(path: string) {
    return new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio();

      audio.addEventListener("canplaythrough", () => {
        resolve(audio);
      });

      audio.addEventListener("error", (error) => {
        console.error(error, error.target);
        reject();
      });

      audio.src = path;
      audio.load();
    });
  }
}
