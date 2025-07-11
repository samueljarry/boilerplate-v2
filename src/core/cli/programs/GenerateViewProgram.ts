import { confirm, select } from "@inquirer/prompts";
import type { Command } from "@commander-js/extra-typings";
import { AbstractProgram } from "../abstracts/AbstractProgram";
import { ViewType } from "@/core/commons/constants/views/ViewType";
import { ViewLayer } from "@/core/commons/constants/views/ViewLayer";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";
import { pathFromRoot } from "../utils/getPathFromRoot";
import fs from 'fs';
import { splitByMethodBody } from "../utils/splitByMethodBody";
import { getInitCommandList } from "../utils/getInitCommandList";
import { convertStringToIdFormat } from "../utils/convertStringToIdFormat";
import { writeIdToStringEnum } from "../utils/addIdToStringEnum";
import { formatFilenameSuffix } from "../utils/formatFilename";
import { PromptService } from "../services/PromptService";
import { writeInitializationInsideInitCommand } from "../utils/writeInitializationInsideInitCommand";
import { createNewFile } from "../utils/createNewFile";
import { readFilesInFolder } from "../utils/readFilesInFolder";

type GenerateViewProgramParams = {
  askToInitInsideScene: boolean
}

type Options = {
  name: string;
  type: ViewType;
  layer: ViewLayer;
  initcommand: string;
};

type TemplateOptions = {
  id: string;
};

type ViewTypeParams = {
  template: string;
  directory: string;
  suffix: string;
  extension: string;
  initTemplate: string;
};

export class GenerateViewProgram extends AbstractProgram<Options> {
  protected override readonly TEMPLATE_DIRECTORY =
    "src/core/cli/templates/views";
  private readonly VIEW_ID_FILE_PATH = pathFromRoot(
    "src/core/commons/constants/views/ViewId.ts"
  );

  private _params: GenerateViewProgramParams;
  private _additionalOptions: TemplateOptions;
  private _viewTypesParamsMap: Map<ViewType, ViewTypeParams> = new Map();
  private _viewTypeParams: ViewTypeParams;
  private _initalizedInScene = false;
  private _scene: string;

  constructor(params?: GenerateViewProgramParams) {
    super();

    this._params = {
      askToInitInsideScene: true,
      ...params
    }

    this._setViewTypeParamsMap();
  }

  // #region data initialization
  protected override setPromptsMap(): void {
    this._promptsMap.set(
      "name",
      PromptService.NamePrompt("How would you like to call your View ?")
    );

    this._promptsMap.set(
      "type",
      PromptService.EnumPrompt(this._getChoicesFromEnum(ViewType), "View type:")
    );

    this._promptsMap.set(
      "layer",
      PromptService.LayerPrompt(
        this._getChoicesFromEnum(ViewLayer, {
          highlightValue: true,
        }),
        "Layer (z-index):"
      )
    );

    this._promptsMap.set("initcommand", PromptService.InitCommandListPrompt());
  }

  private _setViewTypeParamsMap(): void {
    this._viewTypesParamsMap.set(ViewType.VUE, {
      template: "VueView.hbs",
      directory: "src/views/vue/",
      extension: ".vue",
      suffix: "VueView",
      initTemplate: "InitializeVueView.hbs",
    });

    this._viewTypesParamsMap.set(ViewType.THREE, {
      template: "ThreeView.hbs",
      directory: "src/views/three/",
      extension: ".ts",
      suffix: "ThreeView",
      initTemplate: "InitializeThreeView.hbs",
    });
  }

  protected override setProgramOptions(
    program: Command<[], Options, {}>
  ): void {
    program
      .option("-n, --name <name>")
      .option("-t, --type <type>")
      .option("-l, --layer <layer>")
      .option("-i, --initcommand <initcommand>")
      .description("Generates a view file");
  }
  // #endregion

  protected override async action() {
    await this._setVars();
    
    await this._askAdditionalPrompts();
    this._writeFiles();
  }

  private _writeFiles() {
    const params = {
      ...this._answers,
      ...this._additionalOptions,
    };

    writeIdToStringEnum(this.VIEW_ID_FILE_PATH, this._additionalOptions.id);
    writeInitializationInsideInitCommand(this._answers.initcommand, {
      methodToInjectIn: "initViews",
      templatePath: pathFromRoot(
        this.TEMPLATE_DIRECTORY,
        this._viewTypeParams.initTemplate
      ),
      params,
    });

    createNewFile(
      pathFromRoot(
        this._viewTypeParams.directory,
        this._answers.name + this._viewTypeParams.extension
      ),
      {
        params,
        templatePath: pathFromRoot(
          this.TEMPLATE_DIRECTORY,
          this._viewTypeParams.template
        ),
      }
    );
  }

  private async _askAdditionalPrompts() {
    await this._askToInitInsideScene();
  }

  private async _askToInitInsideScene() {
    if (!this._params.askToInitInsideScene) return;
    
    this._initalizedInScene = await confirm({
      message: "Would you like to add the newly generated view to a Scene ?",
      default: true,
    });

    if (!this._initalizedInScene) return;

    // Add initialization inside file
    const scenesFolder = pathFromRoot('src/scenes');
    const files = readFilesInFolder(scenesFolder, true)
      .map((fileName) => fileName.split(scenesFolder + '/')[1]);

    const targetFile = await select<string>({
      choices: files,
      message: 'In which Scene would you like to initialize it ?'
    });

    this.initializeInSceneFile(scenesFolder + "/" + targetFile)
  }

  public initializeInSceneFile(sceneFile: string) {
    this._scene = sceneFile.split("/").pop() as string;
    
    const sceneFileContent = fs.readFileSync(sceneFile, "utf-8");
    const [before, after] = splitByMethodBody("constructor", sceneFileContent);
    console.log("before", before, "after", after);
    const lineToAdd = `\n    this._views.add(ViewId.${this._additionalOptions.id})\n  `;
    const newSceneFileContent = before + lineToAdd + after;

    fs.writeFileSync(sceneFile, newSceneFileContent);
  }

  protected override printRecap(): void {
    const viewIdFile = this.VIEW_ID_FILE_PATH.split("/").pop();

    super.printRecap("✅ View generated successfully !", [
      `✍️  Added ${this._additionalOptions.id} in ${viewIdFile}`,
      `🔧  View initialized in ${this._answers.initcommand}`,
      ...(this._initalizedInScene ? [`➕  View added in ${this._scene}`] : []),
      `📁  Created ${this._answers.name + this._viewTypeParams.extension}`,
    ]);
  }

  // #region vars initialization
  private async _setVars() {
    this._viewTypeParams = getOrThrowError(
      this._viewTypesParamsMap,
      ViewType[this._answers.type],
      `
        No params found for view type: "${this._answers.type}"
        Please add a corresponding entry in the "_viewTypeParamsMap" in your code.

        Missing key: "${this._answers.type}"
      `
    );

    this._additionalOptions = {
      id: convertStringToIdFormat(this._answers.name),
    };

    this._answers.name = formatFilenameSuffix(
      this._answers.name,
      this._viewTypeParams.suffix
    );
  }
  // #endregion

  // #region getters / setters
  public get id() { return this._additionalOptions.id; }
  // #endregion
}

// new GenerateViewProgram();