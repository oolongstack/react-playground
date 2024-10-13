import copy from "copy-to-clipboard";
import { Download, Share2 } from "lucide-react";
import logoSvg from "../assets/react.svg";
import { usePlaygroundStore } from "../store/playground";
import { downloadFiles } from "../utils";
export default function Header() {
  const { files } = usePlaygroundStore();
  return (
    <div
      className="flex items-center justify-between p-2"
      style={{ borderBottom: "1px solid #000" }}
    >
      <div className="flex gap-2 items-center">
        <img alt="logo" src={logoSvg} />
        <span className="font-sans">React Playground</span>
      </div>
      <div className="flex justify-center">
        <Share2
          className="ml-3 cursor-pointer"
          onClick={() => {
            copy(window.location.href);
            alert("链接已复制到剪切板");
          }}
        />

        <Download
          className="ml-3 cursor-pointer"
          onClick={async () => {
            await downloadFiles(files);
            alert("文件已下载到本地");
          }}
        />
      </div>
    </div>
  );
}
