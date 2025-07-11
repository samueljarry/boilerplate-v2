import type { Command, OptionValues } from "@commander-js/extra-typings";
import { AbstractProgram } from "../abstracts/AbstractProgram";
import { confirm, select } from "@inquirer/prompts";
import { GenerationPrograms, GenerationProgramsId } from "../constants/GenerationPrograms";
import { getOrThrowError } from '../../commons/utils/getOrThrow';

type Options = {
  program: GenerationProgramsId;
}

export class MainGenerateProgram extends AbstractProgram<Options> {
  constructor() {
    super();
    this.run()
  }

  protected override setProgramOptions(program: Command<[], Options, {}>): void {
    program
      .option("-p, --program <program>")
      .description(
        "Automatically generate files for your project using predefined programs."
      );
  }

  protected override setPromptsMap(): void {
    this._promptsMap.set(
      "program",
      this._createPrompt(select, {
        message: "🚀    What would you like to generate ?\n",
        choices: Array.from(GenerationPrograms.entries()).map(([key, { name }]) => ({name, value: key}))
      })
    );
  }

  protected override printRecap(): void {
    super.printRecap(null)
  }

  protected override async action(options: Options) {
    await this._playGenerateCommand()
  }

  private async _playGenerateCommand() {
    const { program } = getOrThrowError(GenerationPrograms, this._answers.program)

    const Program = new program();
    await Program.run();
    
    if(!Program.completed) return;

    const shouldRegenerateSomething = await confirm({
      message: 'Would you like to generate something else ?',
      default: true,
    })

    if(shouldRegenerateSomething) {
      new MainGenerateProgram()
    } 
    else {
      
    }
  }
}

new MainGenerateProgram()