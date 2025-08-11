export const worldPosition = /* glsl */ `
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
`;