import { ShaderMaterial, WebGLRenderer, type WebGLProgramParametersWithUniforms } from "three";

export abstract class CustomShaderMaterial extends ShaderMaterial {
  override onBeforeCompile(parameters: WebGLProgramParametersWithUniforms, renderer: WebGLRenderer): void {
    parameters.vertexShader = this._rewriteVertexShader(parameters.vertexShader)
    parameters.fragmentShader = this._rewriteFragmentShader(parameters.fragmentShader)
    
    super.onBeforeCompile(parameters, renderer)
  }

  protected abstract _rewriteVertexShader(vertexShader: string): string
  protected abstract _rewriteFragmentShader(fragmentShader: string): string
}