import { IFlow, ListsNode } from "@/interfaces/IFlow"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: IFlow = {
  nodes: [
    {
      id: "1",
      type: "source",
      data: { label: "Source", value: "text" },
      position: { x: 200, y: 20 },
    },
    // {
    //   id: "2",
    //   type: "keywords",
    //   data: { label: "Input", value: "" },
    //   position: { x: 100, y: 180 },
    // },
    // {
    //   id: "3",
    //   type: "model",
    //   data: { label: "Model", value: "gpt-3.5-turbo" },
    //   position: { x: 350, y: 280 },
    // },
  ],
  lists: [
    {
      type: "source",
      data: { label: "Source", value: "text" },
      position: { x: 200, y: 20 },
    },
    {
      type: "keywords",
      data: { label: "Input", value: "" },
      position: { x: 100, y: 180 },
    },
    {
      type: "model",
      data: { label: "Model", value: "gpt-3.5-turbo" },
      position: { x: 350, y: 280 },
    },
  ],
  nodeIdCounter: 1,
}

export const flow = createSlice({
  name: "flow",
  initialState,
  reducers: {
    reset: () => initialState,
    setFlow: (state, action: PayloadAction<IFlow>) => {
      return { state, ...action.payload }
    },
    updateNodeData: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      const { id, data } = action.payload
      const node = state.nodes.find((node) => node.id === id)
      if (node) {
        node.data.value = data
      }
    },
    addNode: (state, action: PayloadAction<{ node: ListsNode }>) => {
      state.nodeIdCounter += 1
      const newNode = {
        ...action.payload.node,
        id: state.nodeIdCounter as unknown as string,
      }
      state.nodes.push(newNode)
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload
      state.nodes = state.nodes.filter((node) => node.id !== nodeId)
    },
  },
})

export const { setFlow, updateNodeData, deleteNode, addNode, reset } =
  flow.actions
export default flow.reducer
