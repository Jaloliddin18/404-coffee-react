import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";

export default function DiscoverSection() {
  return (
    <div className="discover-section" style={{ position: "relative" }}>
      {/* Coffee Blast - right bottom of learn more button */}
      <img
        src="/img/coffee-blast-1.png"
        alt=""
        style={{
          position: "absolute",
          marginTop: 40,
          left: -121,
          width: 498,
          height: 272,
          pointerEvents: "none",
        }}
      />
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
            <img
              src="/img/coffee-cup-beans.jpg"
              alt="Coffee cup with beans"
              onError={(e) => {
                e.currentTarget.src =
                  "https://api.builder.io/api/v1/image/assets/TEMP/c9e6f2e4b5833d70e96c7a37954ce1075578ba93?width=1360";
              }}
            />
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
