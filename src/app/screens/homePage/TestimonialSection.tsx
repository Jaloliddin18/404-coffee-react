import React, { useState } from "react";
import { Box, Container, Stack, IconButton } from "@mui/material";

const testimonials = [
  {
    id: 1,
    text: "You will only know the taste of fresh coffee once you taste this coffee shop coffee. It was amazing to watch how they brewed their coffee. You will become hooked after just one cup. ",
    author: "Martin",
    title: "Coffee Enthusiast",
    image: "/img/martin.webp",
  },
  {
    id: 2,
    text: "The quality of coffee here is absolutely outstanding. Every cup is crafted with care and attention to detail. I've become a regular customer and highly recommend this place to anyone who appreciates great coffee.",
    author: "Justin",
    title: "Project Manager",
    image: "/img/justin.webp",
  },
  {
    id: 3,
    text: "Best coffee experience I've had in years. The atmosphere is welcoming, the staff is friendly, and most importantly, the coffee is exceptional. Worth every penny!",
    author: "Chico",
    title: "Model",
    image: "/img/chico.jpg",
  },
  {
    id: 4,
    text: "I visit Bean Scene every morning before work. The consistent quality and friendly staff keep me coming back. This is my go-to place for the perfect start to my day.",
    author: "John",
    title: "Marketing Manager",
    image: "/icons/default-user.svg",
  },
  {
    id: 5,
    text: "My preferred coffee shop. A great espresso is something that everyone can appreciate! They are experts in coffee brewing- Like all of their coffee; it is also pure and free of additional toxins. It's unbeatable. Enjoy yourself!",
    author: "James",
    title: "Mentor",
    image: "/icons/default-user.svg",
  },
];

export default function TestimonialSection() {
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
