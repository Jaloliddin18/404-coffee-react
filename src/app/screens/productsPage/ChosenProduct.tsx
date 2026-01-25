import React, { useEffect, useState } from "react";
import { Container, Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Divider from "../../components/divider";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";

import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { Product } from "../../../lib/types/product";
import { setChosenProduct, setRestaurant } from "./slice";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Member } from "../../../lib/types/member";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";
import {
  toastErrorHandling,
  toastTopSuccessAlert,
} from "../../../lib/toastAlert";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  }),
);
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({
    restaurant,
  }),
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const { authMember } = useGlobals();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        // Check if product has meLiked property from backend
        setIsLiked((data as any).meLiked ?? false);
        setLikeCount((data as any).productLikes ?? 0);
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getCoffeeShop()
      .then((data: Member) => setRestaurant(data))
      .catch((err: any) => console.log(err));
  }, [productId]);

  const handleLikeProduct = async () => {
    try {
      if (!authMember) {
        toastErrorHandling(Messages.error1);
        return;
      }

      const previousLikeCount = likeCount;
      const productService = new ProductService();
      const result = await productService.likeTargetProduct(productId);

      // Get new like count from response
      const newLikeCount = (result as any).productLikes ?? 0;
      setLikeCount(newLikeCount);

      // Determine if we just liked or unliked based on count change
      // If count increased, we liked. If count decreased, we unliked.
      if (newLikeCount > previousLikeCount) {
        setIsLiked(true);
        await toastTopSuccessAlert("Added to favorites!", 1000);
      } else {
        setIsLiked(false);
        await toastTopSuccessAlert("Removed from favorites!", 1000);
      }
    } catch (err) {
      console.log(err);
      toastErrorHandling(Messages.error1);
    }
  };

  if (!chosenProduct) return null;

  return (
    <div className={"chosen-product"}>
      <Box className={"title"}>Product Detail</Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img className="slider-image" src={imagePath} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>
              {chosenProduct?.productName}
            </strong>
            <span className={"resto-name"}>{restaurant?.memberNick}</span>
            <span className={"resto-name"}>{restaurant?.memberPhone}</span>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.productViews}</span>
                </div>
                <div className={"product-view"} style={{ marginLeft: "20px" }}>
                  <FavoriteIcon sx={{ mr: "5px", color: "#d32f2f" }} />
                  <span>{likeCount}</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>
              {chosenProduct?.productDesc
                ? chosenProduct?.productDesc
                : "No Description"}
            </p>
            <Divider height="1" width="100%" bg="#000000" />
            <div className={"product-price"}>
              <span>Price:</span>
              <span>${chosenProduct?.productPrice}</span>
            </div>
            <div
              className={"button-box"}
              style={{ display: "flex", gap: "12px" }}
            >
              <Button
                variant="contained"
                onClick={handleLikeProduct}
                sx={{
                  minWidth: "50px",
                  backgroundColor: "#d32f2f",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#b71c1c",
                  },
                }}
              >
                <FavoriteIcon />
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  onAdd({
                    _id: chosenProduct._id,
                    quantity: 1,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: chosenProduct.productImages[0],
                  });
                  e.stopPropagation();
                }}
              >
                Add To Basket
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
