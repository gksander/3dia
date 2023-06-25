import * as THREE from "three";

export const isRay = (el: unknown): el is THREE.Ray => el instanceof THREE.Ray;

const XYPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const planeIntersectPoint = new THREE.Vector3();

export const getXYPlaneIntersectPoint = (ray: THREE.Ray): [number, number] => {
  ray.intersectPlane(XYPlane, planeIntersectPoint);
  return [planeIntersectPoint.x, planeIntersectPoint.y];
};

export const getXYPlaneIntersectPointFromEvent = (
  event: any
): [number, number] => {
  const ray = event?.ray;
  if (!isRay(ray)) return [0, 0];
  return getXYPlaneIntersectPoint(ray);
};
