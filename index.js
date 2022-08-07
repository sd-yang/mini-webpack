import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAst } from 'babel-core';
let id = 0;

function createAsset(filePath) {
    // 1. 获取文件的内容 通过 ast 获取文件内容树
    const source = fs.readFileSync(filePath, {
        encoding: "utf-8"
    });

    // 2. 获取依赖关系
    const ast = parser.parse(source, {
        sourceType: "module"
    });

    const deps = [];
    traverse.default(ast, {
        ImportDeclaration({ node }) {
            deps.push(node.source.value)
        }
    });

    const { code } = transformFromAst(ast, null, {
        presets: ["env"]
    });

    return { code, deps, filePath, id: id++, mapping: {} };
};

// 将文件关系转化为 graph
function createGraph() {
    const mainAsset = createAsset('./example/main.js');

    const queue = [mainAsset];
    for (const asset of queue) {
        asset.deps.forEach(relativePath => {
            const child = createAsset(path.resolve('./example', relativePath));
            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }
    return queue;
}

let graph = createGraph();

function build(graph) {
    const template = fs.readFileSync("./bundle.ejs", { encoding: "utf-8" });
    const data = graph.map(asset => {
        return {
            id: asset.id,
            code: asset.code,
            mapping: asset.mapping
        }
    })

    const code = ejs.render(template, { data });
    fs.writeFileSync("./dist/bundle.js", code);
}

build(graph);
