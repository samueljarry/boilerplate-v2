export class ImageLoader {
  public static async Load(path: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => {
        resolve(image);
      });

      image.addEventListener("error", (error) => {
        reject(new Error(`Error loading image: ${error}`));
      });

      image.src = path;
    });
  }
}
