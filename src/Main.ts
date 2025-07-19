import { CoreInitCommand } from "@/core/commons/commands/CoreInitCommand";
import { GlobalInitCommand } from "@/commands/inits/GlobalInitCommand";
import { SingleUseAction } from "@/core/commons/utils/SingleUseAction";
import { Ticker } from "@/core/commons/utils/Ticker";

export class Main {
  private static _Started = false;
  private static _Initialized = false;
  public static OnStart = new SingleUseAction();
  public static OnAfterInit = new SingleUseAction();
  public static readonly Inits = [
    CoreInitCommand,
    GlobalInitCommand,
  ] as const;

  public static async Init() {
    await this._LoadInitCommands();

    this._Initialized = true;
    this.OnAfterInit.execute();
  }

  private static async _LoadInitCommands() {
    const promises = this.Inits.map(async (initCommandClass) => {
      const initCommand = new initCommandClass();
      await initCommand.init();
    });

    await Promise.all(promises);
  }

  public static Start() {
    this._Started = true;
    Ticker.EnableStats();
    Ticker.Start();

    this.OnStart.execute();
  }
  
  public static get Initialized() { return this._Initialized; }
  public static get Started() { return this._Started; }
}