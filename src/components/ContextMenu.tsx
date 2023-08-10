interface ContextProps {
  id: string
  top: number
  left: number
  bottom: number
  right: number
  nodes: NodeProps[]
  onMenuClick: (type: string, id: string) => string
}

import React, { useCallback } from "react"
import { NodeProps, useReactFlow } from "reactflow"

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  nodes,
  onMenuClick,
}: ContextProps) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow()

  return (
    <div className="flex flex-col ">
      <div
        className="absolute z-10 bg-white  shadow-2xl rounded-md border-slate-500 w-[300px] h-[200px]"
        style={{ top, left, right, bottom }}
      >
        <div className="font-bold text-1xl  border-slate-200 border-b-2 px-2 py-2 ">
          Integration Flow
        </div>
        <div className="">
          {nodes?.map((item, index) => {
            return (
              <p
                onClick={() => onMenuClick(item.type, id)}
                className="hover:cursor-pointer  hover:bg-slate-200  py-2"
                key={index}
              >
                <span className="py-4 px-4">{item.data?.label}</span>
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}
