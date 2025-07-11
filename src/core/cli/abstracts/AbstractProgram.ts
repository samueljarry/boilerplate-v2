import { Command, type OptionValues } from "@commander-js/extra-typings";
import path from 'path';
import { fileURLToPath } from "url";
import { pathFromRoot } from "../utils/getPathFromRoot";
import {
  confirm,
  editor,
  expand,
  checkbox,
  select,
  input,
  number,
  password,
  rawlist,
  search,
} from "@inquirer/prompts";

export type PromptFunction =
  | typeof confirm
  | typeof editor
  | typeof expand
  | typeof checkbox
  | typeof select
  | typeof input
  | typeof number
  | typeof password
  | typeof rawlist
  | typeof search;

export type PromptParam<T extends PromptFunction> = Parameters<T>[0];
export type PromptTuple<T extends PromptFunction = PromptFunction> = [
  T,
  PromptParam<T>
];


const __filename = fileURLToPath(import.meta.url);

export abstract class AbstractProgram<T extends OptionValues> {
  protected readonly TEMPLATE_DIRECTORY = pathFromRoot(
    "src/core/cli/templates"
  );
  protected readonly __dirname = path.dirname(__filename);
  protected _promptsMap = new Map<keyof T, PromptTuple>();
  protected _program = new Command<[], T>();
  protected _options: T;
  protected _answers: T;
  protected _completed = false;

  constructor() {}

  public async run() {
    this._setup();
    this._program.action(this._runAction);
    await this._build();
  }

  protected _setup(): void {
    this.setPromptsMap();
    this.setProgramOptions(this._program);
  }

  /**
   * @description
   * Defines all command-line options for the program.
   * This abstract method must be implemented in each subclass to specify
   * the available options
   *
   * @remarks
   * ###  ⚠️  IMPORTANT :
   *    - Synchronize this method with the type parameter T passed to AbstractProgram<T>.
   *    - For every property in T, there must be a corresponding .option() here.
   *    - If you add or remove options in T, update both the type and this method.
   *    - Type T (passed to AbstractProgram<T>) is the single source of truth for option names and types.
   *    - Commander does NOT infer Option types automatically from .option() calls!
   *
   *    Keep this method empty if you don't have any options to pass.
   *
   * @example
   *
   * protected override _setOptions(program: typeof this._program): void {
   *   program
   *     .option("-w, --what-ever <whatever>")
   *     .description("Does whatever you like");
   * }
   *
   */
  protected abstract setProgramOptions(program: typeof this._program): void;

  protected abstract setPromptsMap(): void;

  protected abstract action(options: T): void | Promise<void>;

  protected _createPrompt<P extends PromptFunction>(
    prompt: P,
    params: PromptParam<P>
  ): [P, PromptParam<P>] {
    return [prompt, params];
  }

  protected _getChoicesFromEnum(
    e: object,
    params?: { highlightValue?: boolean; keyAsValue?: boolean, valueAsName?: boolean }
  ) {
    const highlightValue = params?.highlightValue;
    const keyAsValue = params?.keyAsValue ?? true;
    const valueAsName = params?.valueAsName ?? false;

    const keys = Array.from(
      Object.keys(e).filter((key): key is keyof typeof e => isNaN(Number(key)))
    );

    return keys.map((key) => {
      const value = e[key];
      const name = highlightValue ? key + ` (${value})` : key;

      return {
        name: valueAsName ? value : name,
        value: keyAsValue ? key : value,
      };
    });
  }

  private _runAction = async (options: T) => {
    try {
      this._options = options;
      await this._retrieveOptions(options);
      await this.action(options);
      this.printRecap("✅  Program completed successfully!");

      this._completed = true;
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        console.log("\x1b[1m\x1b[32m%s\x1b[0m", "\n👋 Goodbye!\n");
      } else {
        console.error(error)
      }
    }
  };

  protected printRecap(
    title: string | null,
    actions: string[] = []
  ): void {
    if(!title) return;

    console.log("\x1b[1m\x1b[32m%s\x1b[0m", `\n${title}\n`);

    if(actions.length === 0) return;
    console.log("--------------------------------------------------------\n");
    actions.forEach((action) => {
      console.log("\x1b[36m%s\x1b[0m %s", "•", action);
    });
    console.log("\n--------------------------------------------------------\n\n");
  }

  private async _retrieveOptions(options: T) {
    const additionalOptions = await this._askForNotPerceivedOptions(options);

    this._answers = {
      ...options,
      ...additionalOptions,
    };
  }

  private async _build() {
    await this._program.parseAsync(process.argv);
  }

  protected async _askForNotPerceivedOptions(options: T) {
    const obj: Partial<typeof this._answers> = {};
    const requiredOptions = Array.from(this._promptsMap.entries()).filter(
      ([key]) => !options?.[key]
    );

    for (const [key, [prompt, options]] of requiredOptions) {
      // @ts-ignore
      const answer = await prompt(options);

      obj[key] = answer;
    }

    return obj;
  }

  public get completed() { return this._completed; }
}