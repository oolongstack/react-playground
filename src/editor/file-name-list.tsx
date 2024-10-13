import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { usePlaygroundStore } from "../store/playground";
import { cn } from "../utils/cn";
import {
  APP_COMPONENT_FILE_NAME,
  ENTRY_FILE_NAME,
  IMPORT_MAP_FILE_NAME,
} from "../utils/files";

export default function FileNameList() {
  const {
    files,
    setSelectedFileName,
    selectedFileName,
    updateFileName,
    addFile,
    removeFile,
  } = usePlaygroundStore();
  const [creating, setCreating] = useState(false);

  console.log("files: ", files);
  const fileNames = useMemo(() => {
    return Array.from(files.keys());
  }, [files]);

  function handleEditComplete(oldName: string, newName: string) {
    updateFileName(oldName, newName);
    setSelectedFileName(newName);
    setCreating(false);
  }
  function addTab() {
    const newFileName = "Comp" + Math.random().toString().slice(2, 6) + ".tsx";
    addFile(newFileName);
    setSelectedFileName(newFileName);
    setCreating(true);
  }

  function handleRemove(fileName: string) {
    removeFile(fileName);
    // 选中入口文件
    setSelectedFileName(ENTRY_FILE_NAME);
  }

  const readonlyFileNames = [
    ENTRY_FILE_NAME,
    IMPORT_MAP_FILE_NAME,
    APP_COMPONENT_FILE_NAME,
  ];
  return (
    <ul className="flex h-[40px] items-center pl-3 gap-2 border-b bg-white border-gray-500">
      {fileNames.map((fileName, index) => (
        <li
          className={cn(
            "cursor-pointer flex items-center justify-center h-[40px]",
            fileName === selectedFileName && "text-blue-300"
          )}
          key={fileName}
          onClick={() => setSelectedFileName(fileName)}
        >
          <FileNameItem
            fileName={fileName}
            creating={creating && fileNames.length - 1 === index}
            readonly={readonlyFileNames.includes(fileName)}
            onEditComplete={(newName) => handleEditComplete(fileName, newName)}
            onRemove={(e) => {
              e.stopPropagation();
              handleRemove(fileName);
            }}
          />
        </li>
      ))}
      <li className={"cursor-pointer"} onClick={addTab}>
        +
      </li>
    </ul>
  );
}

function FileNameItem({
  fileName,
  creating,
  readonly, // 是否能被删除和编辑
  onEditComplete,
  onRemove,
}: {
  fileName: string;
  creating: boolean;
  readonly: boolean;
  onEditComplete: (name: string) => void;
  onRemove: MouseEventHandler;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(fileName);
  const [editing, setEditing] = useState(creating);
  function handleDoubleClick() {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleBlur() {
    setEditing(false);
    if (name !== fileName) {
      onEditComplete(name);
    }
  }

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  return (
    <>
      {editing ? (
        <input
          className="w-[80px] py-1 text-base text-[#444] h-[30px] bg-[#ddd] pl-2 border border-[#ddd] rounded outline-none"
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <div className="flex items-center">
          <p onDoubleClick={!readonly ? handleDoubleClick : () => {}}>
            {fileName}
          </p>
          {!readonly && (
            <span className="ml-1 flex" onClick={onRemove}>
              <svg width="12" height="12" viewBox="0 0 24 24">
                <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
                <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
          )}
        </div>
      )}
    </>
  );
}
