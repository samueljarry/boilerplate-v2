import type { AbstractProgram } from "../abstracts/AbstractProgram";
import { GenerateCameraControllerProgram } from '../programs/GenerateCameraControllerProgram';
import { GenerateInitCommandProgram } from "../programs/GenerateInitCommandProgram";
import { GenerateSceneProgram } from "../programs/GenerateSceneProgram";
import { GenerateViewProgram } from "../programs/GenerateViewProgram";

export enum GenerationProgramsId {
  VIEW,
  SCENE,
  CAMERA_CONTROLLER,
  INIT_COMMAND,
}

type GenerationProgramParams = {
  name: string;
  program: new () => AbstractProgram<any>
}

export const GenerationPrograms = new Map<
  GenerationProgramsId,
  GenerationProgramParams
>([
  [
    GenerationProgramsId.SCENE,
    {
      name: "🎬    Scene",
      program: GenerateSceneProgram,
    },
  ],
  [
    GenerationProgramsId.VIEW,
    {
      name: "🖼️     View",
      program: GenerateViewProgram,
    },
  ],
  [
    GenerationProgramsId.CAMERA_CONTROLLER,
    {
      name: "📹    CameraController",
      program: GenerateCameraControllerProgram,
    },
  ],
  [
    GenerationProgramsId.INIT_COMMAND,
    {
      name: "🔄    InitCommand",
      program: GenerateInitCommandProgram,
    },
  ],
]);