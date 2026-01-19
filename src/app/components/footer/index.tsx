import React from "react";
import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <footer className="footer-section" style={{ position: "relative" }}>
      <img
        src="/img/footer-bg.jpg"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      <img
        src="/img/footer-coffee-cup-left.png"
        alt=""
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      />
      <img
        src="/img/footer-coffee-cup-right.png"
        alt=""
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      />
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Stack className="footer-content">
          <Box className="footer-grid">
            {/* Brand Section */}
            <Box className="footer-brand">
              <Box className="footer-brand-name">Bean Scene</Box>
              <Box className="footer-description">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Box>
              <Box className="social-icons">
                <a href="#" aria-label="Facebook" className="social-link">
                  <FacebookIcon />
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <InstagramIcon />
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <TwitterIcon />
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link">
                  <LinkedInIcon />
                </a>
              </Box>
            </Box>

            {/* About Section */}
            <Box className="footer-section-links">
              <Box className="footer-section-title">About</Box>
              <ul className="footer-links-list">
                <li>
                  <a href="/">Menu</a>
                </li>
                <li>
                  <a href="/">Features</a>
                </li>
                <li>
                  <a href="/">News & Blogs</a>
                </li>
                <li>
                  <a href="/">Help & Supports</a>
                </li>
              </ul>
            </Box>

            {/* Company Section */}
            <Box className="footer-section-links">
              <Box className="footer-section-title">Company</Box>
              <ul className="footer-links-list">
                <li>
                  <a href="/">How we work</a>
                </li>
                <li>
                  <a href="/">Terms of service</a>
                </li>
                <li>
                  <a href="/">Pricing</a>
                </li>
                <li>
                  <a href="/">FAQ</a>
                </li>
              </ul>
            </Box>

            {/* Contact Section */}
            <Box className="footer-section-contact">
              <Box className="footer-section-title">Contact Us</Box>
              <Box className="contact-item">
                <Box className="contact-label">Address:</Box>
                <Box className="contact-value">
                  Akshya Nagar 1st Block 1st Cross, Rammurthy nagar,
                  Bangalore-560016
                </Box>
              </Box>
              <Box className="contact-item">
                <Box className="contact-label">Phone:</Box>
                <Box className="contact-value">+1 202-918-2132</Box>
              </Box>
              <Box className="contact-item">
                <Box className="contact-label">Email:</Box>
                <Box className="contact-value">beanscene@mail.com</Box>
              </Box>
              <Box className="contact-item">
                <Box className="contact-label">Website:</Box>
                <Box className="contact-value">www.beanscene.com</Box>
              </Box>
            </Box>
          </Box>

          {/* Footer Bottom */}
          <Box className="footer-bottom">
            <Box className="footer-copyright">
              © 2024 Bean Scene Coffee. All rights reserved.
            </Box>
          </Box>
        </Stack>
      </Container>
    </footer>
  );
}
