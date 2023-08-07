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
import { useGetModelQuery } from "@/redux/services/modelApi"
import { CrossCircledIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useAppDispatch } from "@/redux/hooks"
import { deleteNode } from "@/redux/features/flowSlice"
const ModelNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  const { isLoading, isFetching, data: modelData, error } = useGetModelQuery({})
  const dispatch = useAppDispatch()

  const handleOnChange = (e: string) => {}
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
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Source" />
            {isLoading && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            <SelectGroup>
              {modelData?.models.map((item: any, index) => {
                return (
                  <SelectItem key={index} value={item.id}>
                    {item.id}
                  </SelectItem>
                )
              })}
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

ModelNode.displayName = "ModelNode"

export default memo(ModelNode)
