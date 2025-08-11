import type { Camera, PerspectiveCamera } from "three";

export const getVisibleHeightAtZ = (z: number, camera: PerspectiveCamera) => {
  const cameraOffset = camera.position.z;

  z += z < cameraOffset 
    ? -cameraOffset 
    : cameraOffset;

  const vFOV = (camera.fov * Math.PI) / 180;

  return 2 * Math.tan(vFOV / 2) * Math.abs(z);
};

export const getVisibleWidthAtZ = (z: number, camera: PerspectiveCamera) => {
  const height = getVisibleHeightAtZ(z, camera);
  return height * camera.aspect;
};

export const getVisibleSizesAtZ = (z: number, camera: PerspectiveCamera) => {
  const height = getVisibleHeightAtZ(z, camera);
  
  return {
    height,
    width: height * camera.aspect,
  };
}

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