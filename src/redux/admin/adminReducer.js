import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  loading: false,
  error: null,

};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
  });

            
export default adminSlice.reducer;
