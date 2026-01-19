import React, { useState } from "react";
import { Box, Button, Container, Stack, TextField } from "@mui/material";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribe with email:", email);
    // Add subscription logic here
  };

  return (
    <div
      className="newsletter-section"
      style={{
        backgroundImage: "url('/img/newsletter-bg.jpg')",
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container>
        <Stack className="newsletter-content">
          <Box className="section-title">Subscribe to get the Latest News</Box>
          <Box className="section-subtitle">
            Don't miss out on our latest news, updates, tips and special offers
          </Box>
          <Box className="subscribe-form">
            <TextField
              placeholder="Enter your mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              variant="outlined"
            />
            <Button
              variant="contained"
              className="subscribe-button"
              onClick={handleSubscribe}
            >
              Suscribe
            </Button>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
