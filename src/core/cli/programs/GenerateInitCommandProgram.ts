import fs from 'fs';
import type { Command } from "@commander-js/extra-typings";
import { AbstractProgram } from "../abstracts/AbstractProgram";
import { pathFromRoot } from "../utils/getPathFromRoot";
import { formatFilenameSuffix } from "../utils/formatFilename";
import { PromptService } from "../services/PromptService";
import { confirm } from '@inquirer/prompts';
import { createNewFile } from "../utils/createNewFile";
import { splitByArrayBody } from '../utils/splitByArrayBody';
import { fillTemplate } from '../utils/fillTemplate';

type Options = {
  name: string;
}

export class GenerateInitCommandProgram extends AbstractProgram<Options> {
  protected override TEMPLATE_DIRECTORY = pathFromRoot(
    "src/core/cli/templates/inits"
  );

  private _initCommandAddedInMainInits: boolean;

  constructor() {
    super();
  }

  protected override setProgramOptions(
    program: Command<[], Options, {}>
  ): void {
    program.option("-n, --name <name>").description("Generates an InitCommand");
  }

  protected override setPromptsMap(): void {
    this._promptsMap.set(
      "name",
      PromptService.NamePrompt("How should the InitCommand be called ?")
    );
  }

  protected override async action() {
    this._answers.name = formatFilenameSuffix(
      this._answers.name,
      "InitCommand"
    );

    createNewFile(
      pathFromRoot("src/commands/inits", this._answers.name + ".ts"),
      {
        templatePath: pathFromRoot(this.TEMPLATE_DIRECTORY, 'InitCommand.hbs'),
        params: this._answers
      }
    );

    this._initCommandAddedInMainInits = await confirm({
      message: `Should ${this._answers.name} be added to Main.Inits[] for automatic initialization?`,
      default: true,
    });

    if(this._initCommandAddedInMainInits) {
      this._addToInitCommandsArray();
    }
  }

  private _addToInitCommandsArray(): void {
    const targetFile = pathFromRoot("src/Main.ts");
    const fileContent = fs.readFileSync(targetFile, "utf-8");

    const [before, after] = splitByArrayBody("Inits", fileContent);

    const filledTemplate = fillTemplate(
      pathFromRoot(this.TEMPLATE_DIRECTORY, "InitializeInitCommandInMain.hbs"),
      this._answers
    );

    const [importLine, initLine] = filledTemplate.split('-');

    const newFileContent = importLine + before + initLine + after;

    fs.writeFileSync(targetFile, newFileContent);
  }

  protected override printRecap(): void {
    super.printRecap("✅ InitCommand generated successfully !", [
      `📁   Created ${this._answers.name}.ts`,
      ...(this._initCommandAddedInMainInits ? [`➕   ${this._answers.name} added in Main.Inits[]`] : []),
    ]);
  }
}

// new GenerateInitCommandProgram();