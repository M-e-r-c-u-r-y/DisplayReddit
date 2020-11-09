import { createSlice } from "@reduxjs/toolkit";

export const VisibilitySorters = {
  TIME: "time",
  COMMENTS: "comments",
  SUBMISSIONS: "submissions",
};

const sortersSlice = createSlice({
  name: "visibilitySorters",
  initialState: VisibilitySorters.TIME,
  reducers: {
    setVisibilitySorter(state, action) {
      return action.payload;
    },
  },
});

export const { setVisibilitySorter } = sortersSlice.actions;

export default sortersSlice.reducer;
