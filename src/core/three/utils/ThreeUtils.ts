import {
  Camera,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";

export const X_AXIS = new Vector3(1, 0, 0);
export const Y_AXIS = new Vector3(0, 1, 0);
export const Z_AXIS = new Vector3(0, 0, 1);

export const areQuaternionAligned = (
  qa: Quaternion,
  qb: Quaternion,
  thresholdAngle = 0
): boolean => {
  const qDiff = qa.clone().invert().multiply(qb);
  const angleDiff = 2 * Math.acos(qDiff.w);
  const threshold = MathUtils.degToRad(thresholdAngle);

  return angleDiff < threshold;
};