export class GlobalConstants {
  public static get IsPortrait() {
    return window.innerWidth < window.innerHeight;
  }

  public static get IsLandscape() {
    return !this.IsPortrait;
  }

  public static get Aspect() {
    return window.innerWidth / window.innerHeight;
  }
}