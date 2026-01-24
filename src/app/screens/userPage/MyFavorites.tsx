import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
        // Calculate total pages from metaCounter
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
    <Box display={"flex"} flexDirection={"column"} sx={{ mt: 4 }}>
      <Box className={"menu-name"}>My Favorites</Box>
      <Box className={"menu-content"}>
        <Stack
          className={"favorite-products-wrapper"}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "flex-start",
            mt: 2,
          }}
        >
          {favoriteProducts.length !== 0 ? (
            favoriteProducts.map((product: Product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`;
              const sizeVolume = product.productSize + " size";
              return (
                <Stack
                  key={product._id}
                  className={"product-card"}
                  onClick={() => chooseDishHandler(product._id)}
                  sx={{
                    width: "200px",
                    cursor: "pointer",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Stack
                    className={"product-img"}
                    sx={{
                      backgroundImage: `url(${imagePath})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {sizeVolume}
                    </Box>
                    <Button
                      className="view-btn"
                      sx={{
                        position: "absolute",
                        right: "8px",
                        bottom: "8px",
                        minWidth: "auto",
                        padding: "4px",
                      }}
                    >
                      <Badge
                        badgeContent={product.productViews}
                        color="secondary"
                      >
                        <RemoveRedEyeIcon
                          sx={{
                            color:
                              product.productViews === 0 ? "gray" : "white",
                          }}
                        />
                      </Badge>
                    </Button>
                  </Stack>
                  <Box
                    className={"product-desc"}
                    sx={{
                      padding: "12px",
                      background: "white",
                    }}
                  >
                    <Box
                      className={"product-title"}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginBottom: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.productName}
                    </Box>
                    <Box
                      className={"product-desc-price"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#d4a574",
                        fontWeight: "bold",
                      }}
                    >
                      <MonetizationOnIcon sx={{ fontSize: "18px" }} />
                      {product.productPrice}
                    </Box>
                  </Box>
                </Stack>
              );
            })
          ) : (
            <Box
              sx={{
                textAlign: "center",
                padding: "40px",
                color: "#888",
                width: "100%",
              }}
            >
              No favorite products yet! Like some products to see them here.
            </Box>
          )}
        </Stack>

        {favoriteProducts.length > 0 && (
          <Stack sx={{ mt: 3, alignItems: "center" }}>
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
