import React, { useEffect, useState } from "react";
import { usePlaygroundStore } from "../store/playground";

// 导入原始的iframe html代码
import { Message } from "../components/message";
import iframeRaw from "../template/iframe.html?raw";
import { compile } from "../utils/compiler";
import { IMPORT_MAP_FILE_NAME } from "../utils/files";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

const Preview: React.FC = () => {
  const { files } = usePlaygroundStore();
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${
          files.get(IMPORT_MAP_FILE_NAME)!.value
        }</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };

  const [compiledCode, setCompiledCode] = useState("");

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  const [error, setError] = useState("");

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files, compiledCode]);

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div className="h-full">
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <Message type="error" content={error} />
    </div>
  );
};

export default Preview;
