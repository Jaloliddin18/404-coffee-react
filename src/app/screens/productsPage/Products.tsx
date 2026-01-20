import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, InputBase, Stack } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.ICED_COFFEE,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  /** Handlers */
  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };
  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };
  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className={"products"}>
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"avatar-big-box"}>
            <Stack className={"search-section"}>
              <Box className={"category-title"}> 404 Coffee </Box>
              <Box className="search-container">
                <Box sx={{ position: "relative", flex: 1 }}>
                  <InputBase
                    placeholder="Type here"
                    className="search-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchProductHandler();
                    }}
                  />
                  {searchText && (
                    <IconButton
                      onClick={() => setSearchText("")}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "4px",
                        color: "#999",
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Button
                  variant="contained"
                  className="search-btn"
                  onClick={searchProductHandler}
                >
                  SEARCH <SearchIcon className="search-icon" />
                </Button>
              </Box>
            </Stack>
          </Stack>

          <Stack className={"dishes-filter-section"}>
            <Button
              variant={"contained"}
              className={"order"}
              color={
                productSearch.order === "createdAt" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("createdAt")}
            >
              New
            </Button>
            <Button
              variant={"contained"}
              className={"order"}
              color={
                productSearch.order === "productPrice" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("productPrice")}
            >
              Price
            </Button>
            <Button
              variant={"contained"}
              className={"order"}
              color={
                productSearch.order === "productViews" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("productViews")}
            >
              Views
            </Button>
          </Stack>

          <Stack className={"list-category-section"}>
            <Stack className="product-category">
              <div>
                <Button
                  variant="contained"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.ICED_COFFEE
                      ? "primary"
                      : "secondary"
                  }
                  className="category-btn"
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.ICED_COFFEE)
                  }
                >
                  Iced Coffee
                </Button>
                <Button
                  variant="contained"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.HOT_COFFEE
                      ? "primary"
                      : "secondary"
                  }
                  className="category-btn"
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.HOT_COFFEE)
                  }
                >
                  Hot Coffee
                </Button>
                <Button
                  variant="contained"
                  color={
                    productSearch.productCollection ===
                    ProductCollection.DESSERT
                      ? "primary"
                      : "secondary"
                  }
                  className="category-btn"
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.DESSERT)
                  }
                >
                  Dessert
                </Button>
                <Button
                  variant="contained"
                  color={
                    productSearch.productCollection === ProductCollection.SALAD
                      ? "primary"
                      : "secondary"
                  }
                  className="category-btn"
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.SALAD)
                  }
                >
                  Salad
                </Button>
                <Button
                  variant="contained"
                  color={
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "primary"
                      : "secondary"
                  }
                  className="category-btn"
                  onClick={() =>
                    searchCollectionHandler(ProductCollection.OTHER)
                  }
                >
                  Other
                </Button>
              </div>
            </Stack>

            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume = product.productSize + " size";
                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => chooseDishHandler(product._id)}
                    >
                      <Stack
                        className={"product-img"}
                        sx={{ backgroundImage: `url(${imagePath})` }}
                      >
                        <div className={"product-sale"}>{sizeVolume}</div>
                        <Button
                          className={"shop-btn"}
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                            // when shop button pressed stops getting inside the item
                          }}
                        >
                          <img
                            src={"/icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                          />
                        </Button>
                        <Button className="view-btn" sx={{ right: "36px" }}>
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
                      <Box className={"product-desc"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>
                        <div className={"product-desc-price"}>
                          <MonetizationOnIcon />
                          {product.productPrice}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data">Products are not available!</Box>
              )}
            </Stack>
          </Stack>

          <Stack className="pagination-section">
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
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
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Container>
          <Stack className="logo-frame">
            <Box className="logo-text">Our Family Brands</Box>
            <Stack className="image-frame">
              <Box className="image-shadow">
                <img src="/img/gurme.webp" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/seafood.png" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/sweets.png" />
              </Box>
              <Box className="image-shadow">
                <img src="/img/doner.png" />
              </Box>
            </Stack>
          </Stack>
        </Container>
      </div>

      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"title"}>Our address</Box>
            <iframe
              className="area"
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23978.31724985398!2d69.2001211655573!3d41.302561907326606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8be443f4f0a5%3A0x627521cc6eac641e!2sBesh%20Qozon%20Pilaf%20Center!5e0!3m2!1sen!2skr!4v1763138498194!5m2!1sen!2skr"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
