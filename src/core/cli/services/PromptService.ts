import { type PromptTuple } from '../abstracts/AbstractProgram';
import {
  input,
  select,
} from "@inquirer/prompts";
import { getInitCommandList } from '../utils/getInitCommandList';

export class PromptService {
  // #region Public API

  public static NamePrompt(message = "Name:"): PromptTuple<typeof input> {
    return [
      input,
      {
        message,
        required: true,
      } as Parameters<typeof input>[0],
    ] as const;
  }

  public static EnumPrompt<T extends string>(
    choices: { name: string; value: T }[],
    message = "Type:",
  ): PromptTuple<typeof select> {
    return [
      select,
      {
        message,
        choices,
      } as Parameters<typeof select<T>>[0],
    ] as const;
  }

  public static LayerPrompt<T extends string>(
    choices: { name: string; value: T }[], 
    message = "Layer (z-index):",
  ): PromptTuple<typeof select> {
    return [
      select,
      {
        message,
        choices,
      } as Parameters<typeof select<T>>[0],
    ] as const;
  }

  public static InitCommandListPrompt<T extends string>(): PromptTuple<typeof select> {
    return [
      select,
      {
        message: "In which InitCommand would you like to initialize it ?",
        choices: getInitCommandList(),
      } as Parameters<typeof select<T>>[0],
    ] as const;
  }

  // #endregion
}
