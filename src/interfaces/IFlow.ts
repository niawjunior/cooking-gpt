import { Node } from "reactflow"

interface IFlow {
  nodes: Node[]
}
interface NodeType {
  type: "source" | "keywords" | "model"
}
export type { IFlow, NodeType }
