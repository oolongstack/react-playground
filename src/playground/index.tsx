import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useEffect } from "react";
import Header from "../components/header";
import Editor from "../editor";
import Preview from "../editor/preview";
import { usePlaygroundStore } from "../store/playground";
import { compress } from "../utils";

export default function Playground() {
  const { files } = usePlaygroundStore();
  useEffect(() => {
    // map先转为对象再序列化
    const obj = Object.fromEntries(files);
    const hash = compress(JSON.stringify(obj));

    // 反序列化（字符串parse为对象，对象再变为Map）
    // console.log(new Map(Object.entries(JSON.parse(hash))));

    window.location.hash = hash;
  }, [files]);
  return (
    <main className="h-screen">
      <Header />
      <Allotment defaultSizes={[100, 100]}>
        <Allotment.Pane minSize={0}>
          <Editor />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <Preview />
        </Allotment.Pane>
      </Allotment>
    </main>
  );
}
