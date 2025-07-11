import { CamerasType } from "@/core/three/constants/CamerasType";
import { AbstractProgram } from "../abstracts/AbstractProgram";
import type { Command } from "@commander-js/extra-typings";
import { PromptService } from "../services/PromptService";
import { convertStringToIdFormat } from "../utils/convertStringToIdFormat";
import { writeIdToStringEnum } from "../utils/addIdToStringEnum";
import { pathFromRoot } from "../utils/getPathFromRoot";
import { getOrThrowError } from "@/core/commons/utils/getOrThrow";
import { writeInitializationInsideInitCommand } from "../utils/writeInitializationInsideInitCommand";
import { createNewFile } from "../utils/createNewFile";
import { formatFilenameSuffix } from "../utils/formatFilename";

type Options = {
  name: string;
  type: keyof typeof CamerasType;
  initcommand: string;
}

type TemplateOptions = {
  id: string;
}

type TypeRelatedParams = {
  template: string;
}

export class GenerateCameraControllerProgram extends AbstractProgram<Options> {
  private readonly CAMERA_ID_FILE_PATH = pathFromRoot(
    "src/core/three/constants/CamerasId.ts"
  );
  protected override TEMPLATE_DIRECTORY = pathFromRoot('src/core/cli/templates/cameras')
  private _typeParamsMap = new Map<CamerasType, TypeRelatedParams>();
  private _typeParams: TypeRelatedParams;
  private _additionalOptions: TemplateOptions;

  constructor() {
    super();

    this._setTypeParamsMap();
  }

  protected override setProgramOptions(
    program: Command<[], Options, {}>
  ): void {
    program
        .option("-n, --name <name>")
        .option("-t, --type <type>")
        .option("-i, --init <initcommand>")
  }

  protected override setPromptsMap(): void {
    this._promptsMap.set(
      "name",
      PromptService.NamePrompt(
        "How would you like to call the CameraController ?"
      )
    );

    this._promptsMap.set(
      "type",
      PromptService.EnumPrompt(
        this._getChoicesFromEnum(CamerasType, { valueAsName: true }),
        "Camera type:"
      )
    );

    this._promptsMap.set(
      'initcommand',
      PromptService.InitCommandListPrompt()
    )
  }

  private _setTypeParamsMap(): void {
    this._typeParamsMap.set(CamerasType.ORTHOGRAPHIC, {
      template: "OrthographicCameraController.hbs",
    });

    this._typeParamsMap.set(CamerasType.PERSPECTIVE, {
      template: "PerspectiveCameraController.hbs",
    });
  }

  protected override async action() {
    this._additionalOptions = {
      id: convertStringToIdFormat(this._answers.name),
    };

    this._answers.name = formatFilenameSuffix(this._answers.name, "CameraController");

    this._typeParams = getOrThrowError(
      this._typeParamsMap,
      CamerasType[this._answers.type],
      `
        No params found for camera type: "${this._answers.type}"
        Please add a corresponding entry in the "_typeParamsMap" in your code.

        Missing key: "${this._answers.type}"
      `
    );

    const params = {
      ...this._answers,
      ...this._additionalOptions,
    }

    writeIdToStringEnum(this.CAMERA_ID_FILE_PATH, this._additionalOptions.id);
    writeInitializationInsideInitCommand(this._answers.initcommand, {
      methodToInjectIn: "initThree",
      templatePath: pathFromRoot(
        this.TEMPLATE_DIRECTORY,
        'InitializeCamera.hbs'
      ),
      params
    });

    
    createNewFile(
      pathFromRoot("src/controllers/cameras", this._answers.name + '.ts'),
      {
        params,
        templatePath: pathFromRoot(
          this.TEMPLATE_DIRECTORY,
          this._typeParams.template
        ),
      }
    );
  }

  protected override printRecap(): void {
    const enumFile = this.CAMERA_ID_FILE_PATH.split("/").pop();

    super.printRecap("✅ CameraController generated successfully !", [
      `✍️   Added ${this._additionalOptions.id} in ${enumFile}`,
      `🔧   CameraController initialized in ${this._answers.initcommand}`,
      `📁   Created ${this._answers.name}.ts`,
    ]);
  }

  public get id() {
    return this._additionalOptions.id;
  }
}

// new GenerateCameraControllerProgram();