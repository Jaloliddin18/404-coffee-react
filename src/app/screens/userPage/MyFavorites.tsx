import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
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
              const sizeVolume = product.productSize + " size";
              return (
                <Stack
                  key={product._id}
                  className="favorite-card"
                  onClick={() => chooseDishHandler(product._id)}
                >
                  <Stack
                    className="favorite-card-img"
                    style={{ backgroundImage: `url(${imagePath})` }}
                  >
                    <Box className="favorite-card-size">{sizeVolume}</Box>
                    <Button className="favorite-view-btn">
                      <Badge
                        badgeContent={product.productViews}
                        color="secondary"
                      >
                        <RemoveRedEyeIcon
                          sx={{
                            color:
                              product.productViews === 0 ? "white" : "gray",
                          }}
                        />
                      </Badge>
                    </Button>
                  </Stack>
                  <Box className="favorite-card-desc">
                    <Box className="favorite-card-title">
                      {product.productName}
                    </Box>
                    <Box className="favorite-card-price">
                      <MonetizationOnIcon sx={{ fontSize: "18px" }} />
                      {product.productPrice}
                      <FavoriteIcon className="favorite-icon" />
                      {product.productLikes}
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
