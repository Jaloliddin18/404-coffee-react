import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { setFavoriteProducts } from "./slice";
import { retrieveFavoriteProducts } from "./selector";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";

const actionDispatch = (dispatch: Dispatch) => ({
  setFavoriteProducts: (data: Product[]) => dispatch(setFavoriteProducts(data)),
});

const favoritesRetriever = createSelector(
  retrieveFavoriteProducts,
  (favoriteProducts) => ({
    favoriteProducts,
  }),
);

export function MyFavorites() {
  const { setFavoriteProducts } = actionDispatch(useDispatch());
  const { favoriteProducts } = useSelector(favoritesRetriever);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const history = useHistory();
  const limit = 8;

  useEffect(() => {
    const memberService = new MemberService();
    memberService
      .getFavoriteProducts(currentPage, limit)
      .then((data) => {
        setFavoriteProducts(data.list || []);
        const total = data.metaCounter?.[0]?.total || 0;
        setTotalPages(Math.ceil(total / limit) || 1);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    setCurrentPage(value);
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <Box className="my-favorites-section">
      <Box className="favorites-title">My Favorites</Box>
      <Box className="menu-content">
        <Stack className="favorites-wrapper">
          {favoriteProducts.length !== 0 ? (
            favoriteProducts.map((product: Product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              return (
                <Stack
                  key={product._id}
                  className="favorite-card"
                  onClick={() => chooseDishHandler(product._id)}
                >
                  <img
                    src={imagePath}
                    alt={product.productName}
                    className="favorite-image"
                  />

                  <Box className="favorite-info">
                    <Box className="favorite-views">
                      {product.productViews}
                      <RemoveRedEyeIcon
                        sx={{ fontSize: 20, marginLeft: "5px" }}
                      />
                    </Box>

                    <Box className="favorite-name">{product.productName}</Box>
                    <Box className="favorite-description">
                      {product.productDesc
                        ? product.productDesc
                        : `${product.productSize} size`}
                    </Box>

                    <Box className="favorite-footer">
                      <Box className="favorite-price">
                        ${product.productPrice}
                      </Box>
                      <Box className="favorite-likes">
                        <FavoriteIcon
                          style={{ color: "red", fontSize: 18, marginRight: 4 }}
                        />
                        {product.productLikes}
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Box className="no-favorites">
              No favorite products yet! Like some products to see them here.
            </Box>
          )}
        </Stack>

        {favoriteProducts.length > 0 && (
          <Stack className="favorites-pagination">
            <Pagination
              count={totalPages}
              page={currentPage}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color="secondary"
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
}
