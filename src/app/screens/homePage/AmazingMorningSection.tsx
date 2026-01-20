import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

export default function AmazingMorningSection() {
  return (
    <div className="amazing-morning-section">
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/video/coffeeVidoe.mp4" type="video/mp4" />
      </video>
      <Container>
        <Stack className="morning-content">
          <Box className="morning-text">
            <Box className="morning-title">
              Get a chance to have an Amazing morning
            </Box>
            <Box className="morning-description">
              We are giving you are one time opportunity to experience a better
              life with coffee.
            </Box>
            <Box>
              <Button variant="contained" className="morning-order-button">
                Order Now
              </Button>
            </Box>
          </Box>
          <Box className="morning-image">
            <img
              src="/img/coffee-cup-to-go.png"
              alt="Coffee cup"
              className="coffee-cup"
            />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
