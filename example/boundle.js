// 模拟打包成一个文件的过程
// 根据之前生成的 graph 来创建 bundle.js

(function (modules) {
    function require(id) {
        const [fn, mapping] = modules[id];
        const module = {
            exports: {},
        }
        function localRequire(filePath) {
            const id = mapping[filePath];
            return require(id);
        }
        fn(localRequire, module, module.exports);

        return module.exports;
    }

    require(1);

}
)({
    1: [function (require, module, exports) {
        const { foo } = require('./foo.js');
        foo();
    }, { "./foo.js": 2 }],
    2: [function (require, module, exports) {
        function foo() {
            console.log('foo')
        }
        module.exports = {
            foo
        }
    }, {}],
})



