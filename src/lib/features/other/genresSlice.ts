import {createSlice} from "@reduxjs/toolkit";

interface GenresState {
  searchQuery: string;
}


const initialState = {
  searchQuery: "",
} as GenresState;

export const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {setSearchQuery,} = genresSlice.actions;
export default genresSlice.reducer;