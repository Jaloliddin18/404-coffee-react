import React, { useState } from "react";
import { Box, Container, Stack, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

const testimonials = [
  {
    id: 1,
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset.....",
    author: "Jonny Thomas",
    title: "Project Manager",
    image: "/img/customer-jonny-thomas.jpg",
  },
  {
    id: 2,
    text: "The quality of coffee here is absolutely outstanding. Every cup is crafted with care and attention to detail. I've become a regular customer and highly recommend this place to anyone who appreciates great coffee.",
    author: "Sarah Johnson",
    title: "Coffee Enthusiast",
    image: "/icons/default-user.svg",
  },
  {
    id: 3,
    text: "Best coffee experience I've had in years. The atmosphere is welcoming, the staff is friendly, and most importantly, the coffee is exceptional. Worth every penny!",
    author: "Michael Chen",
    title: "Business Owner",
    image: "/icons/default-user.svg",
  },
  {
    id: 4,
    text: "I visit Bean Scene every morning before work. The consistent quality and friendly staff keep me coming back. This is my go-to place for the perfect start to my day.",
    author: "Emily Davis",
    title: "Marketing Manager",
    image: "/icons/default-user.svg",
  },
];

export default function TestimonialSection() {
  const { topUsers } = useSelector(topUsersRetriever);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="testimonial-section">
      <Container>
        <Stack className="testimonial-content">
          <Box className="section-title">Our coffee perfection feedback</Box>
          <Box className="section-subtitle">
            Our customers has amazing things to say about us
          </Box>
          <Box className="testimonial-card">
            <Box className="quote-mark">"</Box>
            <Box className="testimonial-text">{currentTestimonial.text}</Box>
            <Box className="testimonial-author">
              <Box className="author-name">{currentTestimonial.author}</Box>
              <Box className="author-title">{currentTestimonial.title}</Box>
            </Box>
            <Box className="customer-profile">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.author}
                className="customer-photo"
                onError={(e) => {
                  e.currentTarget.src = "/icons/default-user.svg";
                }}
              />
            </Box>
            <Box className="navigation-buttons">
              <IconButton className="nav-button prev" onClick={handlePrevClick}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 25V32L16 24L24 16V23H32V25H24Z" fill="#603809" />
                </svg>
              </IconButton>
              <IconButton className="nav-button next" onClick={handleNextClick}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 25V32L32 24L24 16V23H16V25H24Z" fill="#603809" />
                </svg>
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
