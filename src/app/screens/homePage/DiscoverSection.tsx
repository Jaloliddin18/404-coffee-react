import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

export default function DiscoverSection() {
  return (
    <div className="discover-section" style={{ position: "relative" }}>
      <Container>
        <Stack className="discover-content">
          <Box className="discover-text">
            <Box className="discover-title">Discover the best coffee</Box>
            <Box className="discover-description">
              Bean Scene is a coffee shop that provides you with quality coffee
              that helps boost your productivity and helps build your mood.
              Having a cup of coffee is good, but having a cup of real coffee is
              greater. There is no doubt that you will enjoy this coffee more
              than others you have ever tasted.
            </Box>
            <Box>
              <Button variant="contained" className="learn-more-button">
                Learn More
              </Button>
            </Box>
          </Box>
          <Box className="discover-image">
            <img src="/img/coffee-cup-beans.jpg" alt="Coffee cup with beans" />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
