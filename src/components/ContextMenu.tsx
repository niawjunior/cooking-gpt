interface ContextProps {
  id: string
  top: number
  left: number
  bottom: number
  right: number
}

import React, { useCallback } from "react"
import { useReactFlow } from "reactflow"

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextProps) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow()

  return (
    <div
      className="absolute z-10 bg-white rounded-md border-2 border-slate-500 w-[300px] h-[200px]"
      style={{ top, left, right, bottom }}
      {...props}
    >
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>
    </div>
  )
}
