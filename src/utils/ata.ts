import { setupTypeAcquisition } from "@typescript/ata";
import typescript from "typescript";

// automatic type acquisition (ATA) 自动类型检测
export function createATA(
  onDownloadFile: (code: string, path: string) => void
) {
  const ata = setupTypeAcquisition({
    projectName: "react-playground",
    typescript: typescript,
    logger: console,
    delegate: {
      receivedFile: (code, path) => {
        onDownloadFile(code, path);
      },
    },
  });

  return ata;
}
