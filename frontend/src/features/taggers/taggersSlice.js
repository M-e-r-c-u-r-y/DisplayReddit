import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const taggersSlice = createSlice({
  name: "tags",
  initialState: initialState,
  reducers: {
    addTag(state, action) {
      const { id, datatype, item } = action.payload;
      const idx = state.findIndex((curr) => curr.id === id);
      if (idx > -1) {
        const itemidx = state[idx].data.findIndex(
          (curr) => curr.name === item.name
        );
        if (itemidx > -1) {
          state[idx].data[itemidx] = item;
        } else {
          state[idx].data.push(item);
        }
      } else {
        state.push({ id, datatype, data: [item] });
      }
    },
    resetTags: (state) => initialState,
  },
});

export const { addTag, resetTags } = taggersSlice.actions;

export default taggersSlice.reducer;
