export const gamma2_2 = /* glsl */ `
  vec3 gamma2_2(vec3 col) {
    return pow(col, vec3(1./2.2));
  }
`;