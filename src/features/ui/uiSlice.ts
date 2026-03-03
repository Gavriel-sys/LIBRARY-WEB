import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  search: string;
  category: string;
}

const initialState: UiState = { search: "", category: "all" };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
  },
});

export const { setCategory, setSearch } = uiSlice.actions;
export default uiSlice.reducer;
