import { SceneType } from "@/core/commons/constants/scenes/SceneType";
import { AbstractProgram } from '../abstracts/AbstractProgram';
import { SceneLayer } from "@/core/commons/constants/scenes/SceneLayer";
import type { Command } from "@commander-js/extra-typings";
import { input, select } from "@inquirer/prompts";
import fs from 'fs';
import Handlebars from "handlebars";
import { getInitCommandList } from "../utils/getInitCommandList";
import { CamerasId } from "@/core/three/constants/CamerasId";
import { AssetsId } from "@/core/commons/constants/AssetsId";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";
import { pathFromRoot } from "../utils/getPathFromRoot";
import { convertStringToIdFormat } from "../utils/convertStringToIdFormat";
import { writeIdToStringEnum } from "../utils/addIdToStringEnum";
import { splitByMethodBody } from "../utils/splitByMethodBody";
import { formatFilenameSuffix } from "../utils/formatFilename";
import { PromptService } from "../services/PromptService";
import { writeInitializationInsideInitCommand } from "../utils/writeInitializationInsideInitCommand";
import { createNewFile } from "../utils/createNewFile";
import { GenerateCameraControllerProgram } from "./GenerateCameraControllerProgram";

type Options = {
  name: string;
  type: SceneType;
  layer: SceneLayer;
  initcommand: string;
}

type TemplateOptions = {
  id: string;
}

type SceneTypeParams = {
  template: string;
};

type AdditionalPromptsParams<T = unknown> = [
  string,
  ReturnType<GenerateSceneProgram["_createPrompt"]>,
  ((params: T) => void | Promise<void>)?
];

export class GenerateSceneProgram extends AbstractProgram<Options> {
  protected override readonly TEMPLATE_DIRECTORY =
    "src/core/cli/templates/scenes";

  private readonly CREATE_NEW = "CREATE_NEW";
  private readonly SCENE_ID_FILE_PATH = pathFromRoot(
    "src/core/commons/constants/scenes/SceneId.ts"
  );

  private _additionalOptions: TemplateOptions;
  private _sceneTypesParamsMap: Map<SceneType, SceneTypeParams> = new Map();
  private _additionalPromptsMap: Map<
    SceneType,
    AdditionalPromptsParams<string | boolean | number>[]
  > = new Map();

  private _sceneTypeParams: SceneTypeParams;
  private _typeRelatedAnswers: { [key: string]: unknown } = {};

  constructor() {
    super();

    this._setSceneTypeParamsMap();
    this._setAdditionalPromptsMap();
  }

  // #region initialization
  protected override setProgramOptions(
    program: Command<[], Options, {}>
  ): void {
    program
      .option("-n, --name <name>")
      .option("-t, --type <type>")
      .option("-l, --layer <layer>")
      .option("-i, --initcommand <initcommand>")
      .description(
        "Generates then initialize a new Scene within an InitCommand"
      );
  }

  protected override setPromptsMap(): void {
    this._promptsMap.set(
      "name",
      PromptService.NamePrompt("How should the Scene be called ?")
    );

    this._promptsMap.set(
      "type",
      PromptService.EnumPrompt(
        this._getChoicesFromEnum(SceneType),
        "Scene type:"
      )
    );

    this._promptsMap.set(
      "layer",
      PromptService.EnumPrompt(
        this._getChoicesFromEnum(SceneLayer, {
          highlightValue: true,
        })
      )
    );

    this._promptsMap.set(
      "initcommand",
      PromptService.InitCommandListPrompt()
    );
  }

  private _setAdditionalPromptsMap(): void {
    this._additionalPromptsMap.set(SceneType.THREE, [
      [
        "hdr",
        this._createPrompt(select, {
          message: "Which HDR would you like to use ?",
          choices: this._getChoicesFromEnum(AssetsId).filter(({ name }) =>
            name.startsWith("HDR_")
          ),
        }),
      ],
      [
        "camera",
        this._createPrompt(select, {
          message: "Which Camera would you like to use ?",
          choices: [
            {
              name: "Create a new camera",
              value: this.CREATE_NEW,
            },
            ...this._getChoicesFromEnum(CamerasId),
          ],
        }),
        async (camera) => {
          if (camera === this.CREATE_NEW) {
            const newCameraController = new GenerateCameraControllerProgram();
            await newCameraController.run();
            this._typeRelatedAnswers.camera = newCameraController.id
          }
        },
      ],
    ]);
  }

  private _setSceneTypeParamsMap(): void {
    this._sceneTypesParamsMap.set(SceneType.VANILLA, {
      template: "Scene.hbs",
    });

    this._sceneTypesParamsMap.set(SceneType.THREE, {
      template: "ThreeScene.hbs",
    });
  }
  // #endregion

  protected override async action() {
    this._additionalOptions = {
      id: convertStringToIdFormat(this._answers.name),
    };

    this._answers.name = formatFilenameSuffix(this._answers.name, "Scene");

    this._sceneTypeParams = getOrThrowError(
      this._sceneTypesParamsMap,
      SceneType[this._answers.type],
      `
        No params found for view type: "${this._answers.type}"
        Please add a corresponding entry in the "_sceneTypesParamsMap" in your code.

        Missing key: "${this._answers.type}"
      `
    );

    await this._askTypeRelatedPrompts();
    const params = {
      ...this._answers,
      ...this._typeRelatedAnswers,
      ...this._additionalOptions,
    };
    
    writeIdToStringEnum(this.SCENE_ID_FILE_PATH, this._additionalOptions.id);
    writeInitializationInsideInitCommand(this._answers.initcommand, {
      methodToInjectIn: "initScenes",
      templatePath: pathFromRoot(
        this.TEMPLATE_DIRECTORY,
        "InitializeScene.hbs"
      ),
      params,
    });
    
    createNewFile(pathFromRoot("src/scenes", this._answers.name + ".ts"), {
      params,
      templatePath: pathFromRoot(this.TEMPLATE_DIRECTORY,this._sceneTypeParams.template),
    });
  }

  protected override printRecap(): void {
    const enumFile = this.SCENE_ID_FILE_PATH.split("/").pop();

    super.printRecap("✅ Scene generated successfully !", [
      `✍️   Added ${this._additionalOptions.id} in ${enumFile}`,
      `🔧   Scene initialized in ${this._answers.initcommand}`,
      `📁   Created ${this._answers.name}.ts`,
    ]);
  }

  private async _askTypeRelatedPrompts() {
    const typeRelatedPrompts = this._additionalPromptsMap.get(
      this._answers.type
    );

    if (!typeRelatedPrompts) return;

    for (const [option, [prompt, params], afterPrompt] of typeRelatedPrompts) {
      const answer = await prompt(params);

      this._typeRelatedAnswers[option] = answer;

      if (afterPrompt) {
        await afterPrompt(answer);
      }
    }
  }
} 

// new GenerateSceneProgram()