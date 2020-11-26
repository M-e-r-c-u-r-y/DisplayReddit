import { createSlice } from "@reduxjs/toolkit";

export const VisibilitySorters = {
  TIME: "time",
  COMMENTS: "comments",
  SUBMISSIONS: "submissions",
};

const defaultVisibilitySortersState = localStorage.getItem(
  "defaultVisibilitySorters"
)
  ? JSON.parse(localStorage.getItem("defaultVisibilitySorters"))
  : VisibilitySorters.TIME;

const sortersSlice = createSlice({
  name: "visibilitySorters",
  initialState: defaultVisibilitySortersState,
  reducers: {
    setVisibilitySorter(_, action) {
      localStorage.setItem(
        "defaultVisibilitySorters",
        JSON.stringify(action.payload)
      );
      return action.payload;
    },
  },
});

export const { setVisibilitySorter } = sortersSlice.actions;

export default sortersSlice.reducer;
