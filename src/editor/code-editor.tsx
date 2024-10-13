import MonacoEditor, { EditorProps, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { File } from "../store/playground";
import { createATA } from "../utils/ata";

interface Props {
  file: File;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}
export default function CodeEditor({ file, onChange, options }: Props) {
  const handleEditorMount: OnMount = (editor, monaco) => {
    // add command cmd + s
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });

    // set tsconfig options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2017,
      esModuleInterop: true,
    });

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      ata(content);
    });

    // 先获取一次
    ata(editor.getValue());
  };

  return (
    <MonacoEditor
      height="100%"
      path={file.name}
      language={file.language}
      onMount={handleEditorMount}
      value={file.value}
      onChange={onChange}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options,
      }}
    />
  );
}
