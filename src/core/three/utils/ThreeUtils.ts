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

export const splineBetweenCameras = (
  cameraToMove: Camera,
  startCamera: PerspectiveCamera,
  inBetweenCamera: Camera,
  endCamera: Camera,
  t: number
): void => {
  const pos1 = startCamera.position.lerp(inBetweenCamera.position, t);
  const pos2 = inBetweenCamera.position.lerp(endCamera.position, t);

  const rot1 = startCamera.quaternion.slerp(inBetweenCamera.quaternion, t);
  const rot2 = inBetweenCamera.quaternion.slerp(endCamera.quaternion, t);

  rot1.normalize();
  rot2.normalize();

  cameraToMove.position.lerpVectors(pos1, pos2, t);
  cameraToMove.quaternion.slerpQuaternions(rot1, rot2, t);

  cameraToMove.quaternion.normalize();
};
