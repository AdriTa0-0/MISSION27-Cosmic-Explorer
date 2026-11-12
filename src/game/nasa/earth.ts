import records from "./epic-2024-05-10.json";

const images = import.meta.glob<string>("./assets/epic_*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

export const EPIC_FRAMES = records.flatMap((record) => {
  const url = images[`./assets/${record.image}.jpg`];
  return url ? [{ ...record, url }] : [];
});

export const EARTH_TARGET_LONGITUDE = 90; // South Asia / Bay of Bengal
export const longitudeDistance = (a: number, b: number) =>
  Math.abs(((a - b + 540) % 360) - 180);

export const EARTH_BEARING = (34 * Math.PI) / 180;
export const EARTH_ALTITUDE = Math.PI / 18;
