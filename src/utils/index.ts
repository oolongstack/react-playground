import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import saveAs from "file-saver";
import JSZip from "jszip";
import { Files } from "../store/playground";

export const getFilesFromUrl = () => {
  let files: Files | undefined;
  try {
    const hash = uncompress(window.location.hash.slice(1));
    files = new Map(Object.entries(JSON.parse(hash)));
  } catch (error) {
    console.error(error);
  }
  return files;
};

export function compress(data: string): string {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const str = strFromU8(zipped, true);
  return btoa(str);
}

export function uncompress(base64: string): string {
  const binary = atob(base64);

  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
}

// code download (先使用jszip在浏览器将代码转为zip后再下载)
export async function downloadFiles(files: Files) {
  const zip = new JSZip();

  const keys = Array.from(files.keys());

  keys.forEach((name) => {
    zip.file(name, files.get(name)!.value);
  });

  const blob = await zip.generateAsync({ type: "blob" });

  saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`);
}
