import { Action } from "@/core/commons/utils/Action";
import { CoreInitCommand } from "@/core/commons/commands/CoreInitCommand";
import { GlobalInitCommand } from "@/commands/inits/GlobalInitCommand";
import { SceneId } from "@/core/commons/constants/scenes/SceneId";
import { ScenesManager } from "@/core/commons/managers/ScenesManager";
import { Ticker } from "@/core/commons/utils/Ticker";

export class Main {
  public static _IsInit = false;
  public static OnInit = new Action();
  public static readonly Inits = [
    CoreInitCommand,
    GlobalInitCommand,
  ] as const;

  public static async Init() {
    await this._LoadInitCommands();

    this._IsInit = true;
    this.OnInit.execute();
  }

  private static async _LoadInitCommands() {
    const promises = this.Inits.map(async (initCommandClass) => {
      const initCommand = new initCommandClass();
      await initCommand.init();
    });

    await Promise.all(promises);
  }

  public static Start() {
    ScenesManager.Show(SceneId.DEFAULT);

    Ticker.EnableStats();
    Ticker.Start();
  }

  public static get IsInit() { return this._IsInit; }
}