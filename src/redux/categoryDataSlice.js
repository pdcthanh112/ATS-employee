import { createSlice } from "@reduxjs/toolkit";

const categoryDataSlice = createSlice({
  name: "categoryData",
  initialState: {
    data: {
      jobTitle: null,
      industry: null,
      province: null,
    },
  },
  reducers: {
    setCategoryData: (state, action) => {
      console.log('GGGGGGGGG', action.payload);
      state.data.jobTitle = action.payload.jobTitle;
      state.data.industry = action.payload.industry;
      state.data.province = action.payload.province;
    },
  },
});

export const { setCategoryData } = categoryDataSlice.actions;
export default categoryDataSlice.reducer;
