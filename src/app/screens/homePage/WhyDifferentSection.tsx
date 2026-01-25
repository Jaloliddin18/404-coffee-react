import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

const features = [
  {
    id: 1,
    icon: "/img/coffee-beans-icon.png",
    title: "Supreme Beans",
    description: "Beans that provides great taste",
    highlight: true,
  },
  {
    id: 2,
    icon: "/img/badge-icon.png",
    title: "High Quality",
    description: "We provide the highest quality",
    highlight: false,
  },
  {
    id: 3,
    icon: "/img/coffee-cup-icon.png",
    title: "Extraordinary",
    description: "Coffee like you have never tasted",
    highlight: false,
  },
  {
    id: 4,
    icon: "/img/best-price-icon.png",
    title: "Affordable Price",
    description: "Our Coffee prices are easy to afford",
    highlight: false,
  },
];

export default function WhyDifferentSection() {
  return (
    <div className="why-different-section">
      <Container>
        <Stack className="why-different-content">
          <Box className="section-title">Why are we different?</Box>
          <Box className="section-subtitle">
            We don't just make your coffee, we make your day!
          </Box>
          <Stack className="features-grid">
            {features.map((feature) => (
              <Box
                key={feature.id}
                className={`feature-card ${feature.highlight ? "highlight" : ""}`}
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="feature-icon"
                />
                <Box className="feature-title">{feature.title}</Box>
                <Box className="feature-description">{feature.description}</Box>
              </Box>
            ))}
          </Stack>
          <Box className="call-to-action">
            <Box className="cta-text">
              Great ideas start with great coffee, Lets help you achieve that{" "}
              <span className="cta-highlight">Get started today.</span>
            </Box>
            <Button variant="contained" className="join-button">
              Join Us
            </Button>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
