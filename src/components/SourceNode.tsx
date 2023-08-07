import { memo, useState } from "react"
import { Handle, NodeProps, Position } from "reactflow"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch } from "@/redux/hooks"
import { deleteNode, updateNodeData } from "@/redux/features/flowSlice"
import { NodeType } from "@/types/type.enum"
import { CrossCircledIcon } from "@radix-ui/react-icons"
const SourceNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  const dispatch = useAppDispatch()

  const handleOnChange = (e: string) => {
    dispatch(updateNodeData({ id: id, data: e }))
  }
  return (
    <div className="bg-white w-[200px] flex justify-center flex-col rounded-lg">
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className="flex justify-end py-2 px-2">
        <CrossCircledIcon
          onClick={() => dispatch(deleteNode(id))}
          className="text-red-500"
        />
      </div>
      <div className="flex flex-col justify-center items-center p-2">
        <div>{data?.label}</div>
        <Select
          onValueChange={(e) => handleOnChange(e)}
          defaultValue={data?.value}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="youtubeLink">Youtube Link</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </div>
  )
}

SourceNode.displayName = "SourceNode"

export default memo(SourceNode)
