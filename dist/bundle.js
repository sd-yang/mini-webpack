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

require(0);

}
)({

"0": [function(require, module, exports){
"use strict";

var _base = require("./base.js");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _base2.default)();
console.log('main');
}, {"./base.js":1} ],

"1": [function(require, module, exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var log = function log() {
  console.log('base');
};

exports.default = log;
}, {} ],

})