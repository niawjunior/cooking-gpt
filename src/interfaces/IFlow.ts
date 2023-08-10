import { Node } from "reactflow"

interface IFlow {
  lists: ListsNode[]
  nodes: Node[]
  nodeIdCounter: number
}
interface NodeType {
  type: "source" | "keywords" | "model"
}

type ListsNode = Omit<Node, "id"> // Define the ListsNode type

export type { IFlow, NodeType, ListsNode }
