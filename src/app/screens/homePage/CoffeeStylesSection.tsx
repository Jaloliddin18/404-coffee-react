import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes }),
);

export default function CoffeeStylesSection() {
  const { popularDishes } = useSelector(popularDishesRetriever);

  return (
    <div className="coffee-styles-section">
      <Container>
        <Stack className="coffee-styles-content">
          <Box className="section-title">Enjoy a new blend of coffee style</Box>
          <Box className="section-subtitle">
            Explore all flavours of coffee with us. There is always a new cup
            worth experiencing
          </Box>
          <Stack className="coffee-cards">
            {popularDishes.length > 0 ? (
              popularDishes.map((product: Product) => (
                <Box key={product._id} className="coffee-card">
                  <img
                    src={`${serverApi}/${product.productImages[0]}`}
                    alt={product.productName}
                    className="coffee-image"
                  />
                  <Box className="coffee-info">
                    <Box className="coffee-name">{product.productName}</Box>
                    <Box className="coffee-description">
                      {product.productDesc ||
                        `${product.productSize} | ${product.productVolume}ml`}
                    </Box>
                    <Box className="coffee-price">
                      ${product.productPrice.toFixed(2)}
                    </Box>
                  </Box>
                  <Button variant="contained" className="coffee-order-button">
                    Order Now
                  </Button>
                </Box>
              ))
            ) : (
              <Box className="no-products">
                No products available at the moment
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
