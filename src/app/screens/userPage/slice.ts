import { createSlice } from "@reduxjs/toolkit";
import { UserPageState } from "../../../lib/types/screen";

const initialState: UserPageState = {
  favoriteProducts: [],
};

const userPageSlice = createSlice({
  name: "userPage",
  initialState,
  reducers: {
    setFavoriteProducts: (state, action) => {
      state.favoriteProducts = action.payload;
    },
  },
});

export const { setFavoriteProducts } = userPageSlice.actions;

const UserPageReducer = userPageSlice.reducer;
export default UserPageReducer;
