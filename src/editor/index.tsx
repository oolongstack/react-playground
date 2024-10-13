import { debounce } from "lodash-es";
import { usePlaygroundStore } from "../store/playground";
import { fileName2Language } from "../utils/filename-2-language";
import CodeEditor from "./code-editor";
import FileNameList from "./file-name-list";

export default function Editor() {
  const { files, selectedFileName, setFiles } = usePlaygroundStore();
  console.log("files: ", files);
  const file = files.get(selectedFileName);

  function onEditorChange(value?: string) {
    if (value) {
      const newFiles = new Map(files).set(selectedFileName, {
        name: selectedFileName,
        language: fileName2Language(selectedFileName),
        value: value,
      });

      setFiles(newFiles);
    }
  }
  return (
    <section className="flex flex-col h-full">
      <FileNameList />
      {file && (
        <CodeEditor file={file} onChange={debounce(onEditorChange, 500)} />
      )}
    </section>
  );
}
