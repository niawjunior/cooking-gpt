import { memo, useState } from "react"
import { Handle, NodeProps, Position } from "reactflow"
import { Input } from "./ui/input"
import { NodeType } from "@/types/type.enum"
import { deleteNode, updateNodeData } from "@/redux/features/flowSlice"
import { useAppDispatch } from "@/redux/hooks"
import { debounce } from "lodash"
import { CrossCircledIcon } from "@radix-ui/react-icons"

const InputNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  const dispatch = useAppDispatch()
  const [text, setText] = useState(data?.value)

  const debouncedText = debounce((text: string) => {
    dispatch(updateNodeData({ id: id, data: text }))
  }, 300)
  const handleOnChange = (e: string) => {
    setText(e)
    debouncedText(e)
  }
  return (
    <div className="bg-white w-[200px] flex justify-center flex-col rounded-lg">
      <Handle
        type="target"
        className="w-full"
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
        <Input
          value={text}
          onChange={(e) => handleOnChange(e.target.value)}
          type="text"
          placeholder="Please Input Keyword"
        />
      </div>

      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </div>
  )
}

InputNode.displayName = "InputNode"

export default memo(InputNode)
