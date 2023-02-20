
import * as Parser from 'web-tree-sitter';
// Parser.init().then(async () => {
//   const Cpp = await Parser.Language.load('/tree-sitter-cpp.wasm');
//   parser.setLanguage(Cpp);
// });
export default DataflowGraphWorker({
  intrinsicsMap: {},

  sourceToIntrinsics(source) {
    // Parse the source, get each intrinsic and arguments, create edges of inputs and outputs
    // Compute graph is generated using toposort
    // 



    // console.log(source);
    // const sourceCode = 'let x = 1; console.log(x);';
    // const tree = parser.parse(sourceCode);
    // const callExpression = tree.rootNode.child(1).firstChild;
    // console.log(callExpression);
    return source
  },

  intrinsicsDFGBuilder(intrinsics) {
    console.log(intrinsics);
    let obj = {
      "drawflow":
      {
        "Home": {
          "data": {
            "1": {
              "id": 1,
              "name": "job1",
              "data": {},
              "class": "",
              "html": "<div>job1</div>",
              "typenode": false, "inputs": {},
              "outputs": {
                "output_1": {
                  "connections": [{ "node": "2", "output": "input_1" }]
                }
              },
              "pos_x": 65.42498779296875, "pos_y": 175.28749084472656
            },
            "2": {
              "id": 2,
              "name": "job2",
              "data": {},
              "class": "",
              "html": "<div>job2</div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [{ "node": "1", "input": "output_1" }]
                }
              },
              "outputs": {},
              "pos_x": 464.42498779296875, "pos_y": 135.28749084472656
            }
          }
        }
      }
    }
    return obj;
  },

  // Processing pipeline
  onmessage: (e) => {
    let intrinsics = sourceToIntrinsics(e.data);
    let dfg = intrinsicsDFGBuilder(intrinsics);
    postMessage(dfg)
  }

})
