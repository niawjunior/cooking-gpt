import { useCallback, useEffect, useRef, useState } from "react"
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
  MiniMap,
  NodeProps,
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
import ContextMenu from "./ContextMenu"

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "2", target: "3", animated: true },
]

const panOnDrag = [1, 2]

const minimapStyle = {
  height: 120,
}
const nodeTypes = {
  custom: CustomNode,
  source: SourceNode,
  keywords: InputNode,
  model: ModelNode,
}

const BasicFlow = () => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const ref = useRef<any>(null)
  const flowNodes = useAppSelector((state) => state.flowReducer.nodes)
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)

  const [menu, setMenu] = useState<any>(null)

  const [isOpenContext, setIsOpenContext] = useState(false)
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  )

  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   if (edge.sourceHandle) {
  //     const edgeType = nodes.find((node) => node.type === "custom").data
  //       .selects[edge.sourceHandle]
  //     edge.type = edgeType
  //   }

  //   return edge
  // })

  // const onContextMenu = (e: any) => {
  //   console.log(e.clientX, e.clientY)
  //   e.preventDefault()
  //   setPosition({ x: e.clientX, y: e.clientY })
  //   setIsOpenContext(true)
  // }

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      // Prevent native context menu from showing
      event.preventDefault()

      const pane = ref.current.getBoundingClientRect()
      console.log(event.clientY)
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY - 250,
        left: event.clientX < pane.width - 200 && event.clientX + 100,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      })
    },
    [setMenu]
  )
  const clickNode = () => {
    console.log("hello clicking")
  }
  useEffect(() => {
    setNodes(flowNodes)
  }, [flowNodes, setNodes])
  const proOptions = { hideAttribution: true }

  const onPaneClick = useCallback(() => setMenu(null), [setMenu])

  return (
    <>
      {/* <Button className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600">
        <Play />
      </Button> */}
      <ReactFlow
        ref={ref}
        className="w-full min-h-[100vh]"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeContextMenu={onNodeContextMenu}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        onPaneClick={onPaneClick}
        panOnScroll
        // fitView
        // panOnDrag={panOnDrag}
        // selectionMode={SelectionMode.Partial}
      >
        <Background color="#aaa" gap={16} />
        <MiniMap style={minimapStyle} zoomable pannable />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
      {/* <Panel /> */}
    </>
  )
}

export default BasicFlow
