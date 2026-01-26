import React, { useEffect, useMemo } from "react";
import DiscoverSection from "./DiscoverSection";
import CoffeeStylesSection from "./CoffeeStylesSection";
import WhyDifferentSection from "./WhyDifferentSection";
import AmazingMorningSection from "./AmazingMorningSection";
import TestimonialSection from "./TestimonialSection";
import NewsletterSection from "./NewsletterSection";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

export default function HomePage() {
  const dispatch = useDispatch();
  const { setPopularDishes } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch],
  );

  useEffect(() => {
    // Backend server data request => Data
    // slice: Data => Store
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
      })
      .then((data) => {
        console.log("data passed here", data);
        setPopularDishes(data);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"homepage"}>
      <DiscoverSection />
      <img
        alt=""
        src="/img/coffee-blast-1.png"
        style={{
          position: "absolute",
          left: -80,
          top: 1220,
          width: 478,
          height: 261,
          zIndex: 2,
        }}
      />
      <CoffeeStylesSection />
      <img
        alt=""
        src="/img/coffee-blast-2.png"
        style={{
          position: "absolute",
          right: 0,
          top: 2090,
          width: 300,
          zIndex: 2,
        }}
      />
      <WhyDifferentSection />
      <AmazingMorningSection />
      <img
        src="/img/coffee-blast-3.png"
        alt=""
        style={{
          position: "absolute",
          right: 0,
          top: 3840,
          width: 300,
          zIndex: 2,
        }}
      />
      <img
        src="/img/coffee-blast-4.png"
        alt=""
        style={{
          position: "absolute",
          left: 0,
          top: 4500,
          width: 280,
          zIndex: 2,
        }}
      />
      s
      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
}
