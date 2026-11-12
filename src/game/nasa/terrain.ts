import { MathUtils } from "three";
import metadata from "./moon-terrain.json";
import localData from "./assets/shackleton-local-h16.bin?url&inline";
import regionalData from "./assets/shackleton-regional-h16.bin?url&inline";

function elevationTile(
  encoded: string,
  tile: typeof metadata.tiles.local,
  worldSize: number,
) {
  const bytes = Uint8Array.from(
    atob(encoded.slice(encoded.indexOf(",") + 1)),
    (byte) => byte.charCodeAt(0),
  );
  if (bytes.byteLength !== tile.width * tile.height * 2)
    throw new Error("Invalid LOLA elevation tile size");
  const data = new DataView(bytes.buffer);
  const read = (x: number, y: number) =>
    data.getUint16((y * tile.width + x) * 2, true);
  return (x: number, z: number) => {
    const u = MathUtils.clamp(x / worldSize + 0.5, 0, 1) * (tile.width - 1);
    const v = MathUtils.clamp(z / worldSize + 0.5, 0, 1) * (tile.height - 1);
    const i = Math.floor(u),
      j = Math.floor(v);
    const nextX = Math.min(i + 1, tile.width - 1);
    const nextY = Math.min(j + 1, tile.height - 1);
    const top = MathUtils.lerp(read(i, j), read(nextX, j), u - i);
    const bottom = MathUtils.lerp(read(i, nextY), read(nextX, nextY), u - i);
    return MathUtils.lerp(
      tile.elev_min_m,
      tile.elev_max_m,
      MathUtils.lerp(top, bottom, v - j) / 65535,
    );
  };
}

const LOCAL_WORLD_SIZE = 420;
const local = elevationTile(localData, metadata.tiles.local, LOCAL_WORLD_SIZE);
const regional = elevationTile(regionalData, metadata.tiles.regional, 1440);
const localDatum = local(0, 0);
const regionalDatum = regional(0, 0);

// Both DEM windows are rescaled for play. The central outpost pad is level.
export function terrainHeight(x: number, z: number) {
  const radius = Math.hypot(x, z);
  const near = (local(x, z) - localDatum) * 0.19;
  const far = (regional(x, z) - regionalDatum) * 0.1;
  const relief = MathUtils.lerp(
    near,
    far,
    MathUtils.smoothstep(radius, 105, 230),
  );
  return relief * MathUtils.smoothstep(radius, 24, 38);
}

export function lolaReading(x: number, z: number) {
  const { width, metres_per_pixel } = metadata.tiles.local;
  const step = LOCAL_WORLD_SIZE / (width - 1);
  const dx = (local(x + step, z) - local(x - step, z)) / (2 * metres_per_pixel);
  const dz = (local(x, z + step) - local(x, z - step)) / (2 * metres_per_pixel);
  return {
    elevation: local(x, z),
    slope: MathUtils.radToDeg(Math.atan(Math.hypot(dx, dz))),
  };
}
