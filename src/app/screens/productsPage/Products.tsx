import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  InputBase,
  Stack,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuList,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
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
import Events from "./Events";

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const dispatch = useDispatch();
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.ICED_COFFEE,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  const orderOptions = [
    { label: "New", value: "createdAt" },
    { label: "Price", value: "productPrice" },
    { label: "Views", value: "productViews" },
  ];

  const selectedOrderLabel =
    orderOptions.find((opt) => opt.value === productSearch.order)?.label ||
    "New";

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => dispatch(setProducts(data)))
      .catch((err) => console.log(err));
  }, [productSearch, dispatch]);

  useEffect(() => {
    if (searchText === "") {
      setProductSearch((prev) => {
        if (prev.search === "") return prev;
        return { ...prev, search: "" };
      });
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
              <Box className="search-row">
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
              </Box>
            </Stack>
          </Stack>

          {/* Category ButtonGroup - Horizontal under title */}
          <Box className="category-button-group-container">
            <ButtonGroup
              variant="outlined"
              aria-label="Product category button group"
              className="category-button-group"
            >
              <Button
                onClick={() =>
                  searchCollectionHandler(ProductCollection.ICED_COFFEE)
                }
                sx={{
                  backgroundColor:
                    productSearch.productCollection ===
                    ProductCollection.ICED_COFFEE
                      ? "#8b4513"
                      : "#fff",
                  color:
                    productSearch.productCollection ===
                    ProductCollection.ICED_COFFEE
                      ? "#fff"
                      : "#8b4513",
                  borderColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                    color: "#fff",
                    borderColor: "#a0522d",
                  },
                }}
              >
                Iced Coffee
              </Button>
              <Button
                onClick={() =>
                  searchCollectionHandler(ProductCollection.HOT_COFFEE)
                }
                sx={{
                  backgroundColor:
                    productSearch.productCollection ===
                    ProductCollection.HOT_COFFEE
                      ? "#8b4513"
                      : "#fff",
                  color:
                    productSearch.productCollection ===
                    ProductCollection.HOT_COFFEE
                      ? "#fff"
                      : "#8b4513",
                  borderColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                    color: "#fff",
                    borderColor: "#a0522d",
                  },
                }}
              >
                Hot Coffee
              </Button>
              <Button
                onClick={() =>
                  searchCollectionHandler(ProductCollection.DESSERT)
                }
                sx={{
                  backgroundColor:
                    productSearch.productCollection ===
                    ProductCollection.DESSERT
                      ? "#8b4513"
                      : "#fff",
                  color:
                    productSearch.productCollection ===
                    ProductCollection.DESSERT
                      ? "#fff"
                      : "#8b4513",
                  borderColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                    color: "#fff",
                    borderColor: "#a0522d",
                  },
                }}
              >
                Dessert
              </Button>
              <Button
                onClick={() => searchCollectionHandler(ProductCollection.SALAD)}
                sx={{
                  backgroundColor:
                    productSearch.productCollection === ProductCollection.SALAD
                      ? "#8b4513"
                      : "#fff",
                  color:
                    productSearch.productCollection === ProductCollection.SALAD
                      ? "#fff"
                      : "#8b4513",
                  borderColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                    color: "#fff",
                    borderColor: "#a0522d",
                  },
                }}
              >
                Salad
              </Button>
              <Button
                onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
                sx={{
                  backgroundColor:
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "#8b4513"
                      : "#fff",
                  color:
                    productSearch.productCollection === ProductCollection.OTHER
                      ? "#fff"
                      : "#8b4513",
                  borderColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                    color: "#fff",
                    borderColor: "#a0522d",
                  },
                }}
              >
                Other
              </Button>
            </ButtonGroup>
          </Box>

          {/* Split Button for Order Filter */}
          <Stack className="dishes-filter-section">
            <ButtonGroup
              variant="contained"
              ref={anchorRef}
              aria-label="Order filter split button"
            >
              <Button
                onClick={() => searchOrderHandler(productSearch.order)}
                sx={{
                  backgroundColor: "#8b4513",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                  },
                }}
              >
                {selectedOrderLabel}
              </Button>
              <Button
                size="small"
                aria-controls={
                  orderMenuOpen ? "order-split-button-menu" : undefined
                }
                aria-expanded={orderMenuOpen ? "true" : undefined}
                aria-label="Select order option"
                aria-haspopup="menu"
                onClick={() => setOrderMenuOpen((prev) => !prev)}
                sx={{
                  backgroundColor: "#8b4513",
                  "&:hover": {
                    backgroundColor: "#a0522d",
                  },
                }}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              sx={{ zIndex: 1 }}
              open={orderMenuOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => setOrderMenuOpen(false)}
                    >
                      <MenuList id="order-split-button-menu" autoFocusItem>
                        {orderOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            selected={option.value === productSearch.order}
                            onClick={() => {
                              searchOrderHandler(option.value);
                              setOrderMenuOpen(false);
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Stack>

          <Stack className="list-category-section">
            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => chooseDishHandler(product._id)}
                    >
                      <Box className={"product-image-wrapper"}>
                        <img
                          src={imagePath}
                          alt={product.productName}
                          className={"product-image"}
                        />
                        <Box className="product-overlay">
                          <Box className="product-likes">
                            <FavoriteIcon
                              sx={{ color: "#ffffff", marginRight: "5px" }}
                            />
                            {product.productLikes}
                          </Box>
                          <Box className="product-views">
                            {product.productViews}
                            <RemoveRedEyeIcon
                              sx={{ color: "#ffffff", marginLeft: "5px" }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Box className={"product-info"}>
                        <Box className={"product-name"}>
                          {product.productName}
                        </Box>
                        <Box className={"product-description"}>
                          {product.productDesc
                            ? product.productDesc
                            : `${product.productSize} size`}
                        </Box>
                        <Box className={"product-price"}>
                          ${product.productPrice}
                        </Box>
                      </Box>

                      <Button
                        className={"product-order-button"}
                        onClick={(e) => {
                          onAdd({
                            _id: product._id,
                            quantity: 1,
                            name: product.productName,
                            price: product.productPrice,
                            image: product.productImages[0],
                          });
                          e.stopPropagation();
                        }}
                      >
                        Order Now
                      </Button>
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

      <Events />

      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"title"}>Our address</Box>
            <iframe
              title="Google Maps Location"
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
