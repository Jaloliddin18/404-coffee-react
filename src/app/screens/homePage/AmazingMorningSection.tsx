import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

export default function AmazingMorningSection() {
  return (
    <div
      className="amazing-morning-section"
      style={{
        backgroundImage: "url('/img/morning-coffee-bg.jpg')",
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
              onError={(e) => {
                e.currentTarget.src = "https://api.builder.io/api/v1/image/assets/TEMP/c309d2853da6e3a7237bdd8bcf6f7853acd414c4?width=600";
              }}
            />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
