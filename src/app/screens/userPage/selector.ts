import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectUserPage = (state: AppRootState) => state.userPage;

export const retrieveFavoriteProducts = createSelector(
  selectUserPage,
  (UserPage) => UserPage.favoriteProducts,
);
