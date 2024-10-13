import { PluginObj } from "@babel/core";
import { transform } from "@babel/standalone";
import { File, Files } from "../store/playground";

import { ENTRY_FILE_NAME } from "./files";

// 查看是否引入了React，没引入的话就引入
export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\s+React /g;
  if (
    (filename.endsWith(".jsx") || filename.endsWith(".tsx")) &&
    !regexReact.test(code)
  ) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
};

export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  const _code = beforeTransformCode(filename, code);
  let result = "";
  try {
    result = transform(_code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error("编译出错", e);
  }
  return result;
};

export const compile = (files: Files) => {
  const main = files.get(ENTRY_FILE_NAME)!;
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split("./").pop() || "";

  if (!moduleName.includes(".")) {
    const realModuleName = Array.from(files.keys())
      .filter((key) => {
        return (
          key.endsWith(".ts") ||
          key.endsWith(".tsx") ||
          key.endsWith(".js") ||
          key.endsWith(".jsx")
        );
      })
      .find((key) => {
        return key.split(".").includes(moduleName);
      });

    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files.get(moduleName);
};

// json就直接导出
const json2Js = (file: File) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

const css2Js = (file: File) => {
  const randomId = new Date().getTime();
  // 创建style标签，把样式写进去
  const js = `
    (() => {
        const stylesheet = document.createElement('style')
        stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
        document.head.appendChild(stylesheet)

        const styles = document.createTextNode(\`${file.value}\`)
        stylesheet.innerHTML = ''
        stylesheet.appendChild(styles)
    })()
    `;
  return URL.createObjectURL(
    new Blob([js], { type: "application/javascript" })
  );
};

function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;

        // 处理相对路径的导入
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;

          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2Js(file);
          } else {
            // .js .ts .jsx .tsx
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: "application/javascript",
              })
            );
          }
        }
      },
    },
  };
}
