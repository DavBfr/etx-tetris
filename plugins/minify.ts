import * as ts from "typescript";
import * as tstl from "typescript-to-lua";
const luamin = require('luamin')

const Settings = {
  RenameVariables: true,
  RenameGlobals: false,
  SolveMath: true
}

const plugin: tstl.Plugin = {
  afterPrint(
    program: ts.Program,
    options: tstl.CompilerOptions,
    emitHost: tstl.EmitHost,
    result: tstl.ProcessedFile[],
  ) {
    for (const file of result) {
      file.code = "-- TETRIS, David PHAM-VAN\n" + luamin.minify(file.code)
    }
  },
};

export default plugin;
