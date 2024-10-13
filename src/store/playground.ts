import { create } from "zustand";
import { getFilesFromUrl } from "../utils";
import { fileName2Language } from "../utils/filename-2-language";
import { ENTRY_FILE_NAME, initFiles } from "../utils/files";

export interface File {
  name: string;
  value: string;
  language: string;
}

// files
export type Files = Map<string, File>;
interface PlaygroundState {
  files: Files;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFieldName: string, newFieldName: string) => void; //
}

export const usePlaygroundStore = create<PlaygroundState>()((set) => ({
  files: getFilesFromUrl() || new Map(initFiles),
  selectedFileName: ENTRY_FILE_NAME,
  setSelectedFileName: (fileName: string) =>
    set({ selectedFileName: fileName }),
  setFiles: (files: Files) => set({ files }),
  addFile: (fileName: string) =>
    set((state) => ({
      files: new Map(state.files).set(fileName, {
        name: fileName,
        value: "",
        language: fileName2Language(fileName),
      }),
    })),

  // delete file
  removeFile: (fileName: string) =>
    set((state) => {
      const newFiles = new Map(state.files);
      newFiles.delete(fileName);
      return { files: newFiles };
    }),

  // update file name

  updateFileName: (oldFieldName: string, newFieldName: string) =>
    set((state) => {
      const oldFiles = new Map(state.files);
      const newFiles = new Map();
      for (const [key, value] of oldFiles) {
        if (key === oldFieldName) {
          newFiles.set(newFieldName, value);
        } else {
          newFiles.set(key, value);
        }
      }
      return {
        files: newFiles,
      };
    }),
}));
