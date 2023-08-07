import { useCallback, useEffect } from "react"
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  SelectionMode,
} from "reactflow"

import CustomNode from "./CustomNode"
import SourceNode from "./SourceNode"
import InputNode from "./InputNode"

import "reactflow/dist/style.css"
import ModelNode from "./ModelNode"
import { Button } from "./ui/button"
import { Play } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import Panel from "./Panel"
import { setFlow } from "@/redux/features/flowSlice"

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "2", target: "3", animated: true },
]

const panOnDrag = [1, 2]

const nodeTypes = {
  custom: CustomNode,
  source: SourceNode,
  keywords: InputNode,
  model: ModelNode,
}

const BasicFlow = () => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const flowNodes = useAppSelector((state) => state.flowReducer.nodes)
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  )

  useEffect(() => {
    setNodes(flowNodes)
  }, [flowNodes, setNodes])
  const proOptions = { hideAttribution: true }

  return (
    <>
      <Button className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600">
        <Play />
      </Button>
      <div className="flex">
        <ReactFlow
          className="w-screen min-h-[70vh]"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          panOnScroll
          selectionOnDrag
          // panOnDrag={panOnDrag}
          // selectionMode={SelectionMode.Partial}
        >
          <Background />
        </ReactFlow>
        <Panel />
      </div>
    </>
  )
}

export default BasicFlow
