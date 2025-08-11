export class VideoLoader {
  public static async Load(path: string) {
    return new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement("video");

      video.addEventListener("loadeddata", () => {
        resolve(video);
      });

      video.addEventListener("error", (error) => {
        reject(new Error(`Error loading video: ${error}`));
      });

      video.src = path;
      video.load();
    });
  }
}
