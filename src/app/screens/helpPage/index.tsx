import React from "react";
import { Box, Container, Stack, Tabs } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import "../../../css/help.css";
import { faq } from "../../../lib/data/faq";
import { terms } from "../../../lib/data/terms";

export default function HelpPage() {
  const [value, setValue] = React.useState("1");

  /** HANDLERS **/
  const handleChange = (e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={"help-page"}>
      <Container className={"help-container"}>
        <TabContext value={value}>
          <Box className={"help-menu"}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="lab API tabs example"
                className={"table_list"}
              >
                <Tab label="ABOUT US" value={"1"} />
                <Tab label="TERMS" value={"2"} />
                <Tab label="FAQ" value={"3"} />
                <Tab label="CONTACT" value={"4"} />
              </Tabs>
            </Box>
          </Box>
          <Stack>
            <Stack className={"help-main-content"}>
              <TabPanel value={"1"}>
                <Stack className={"rules-box"}>
                  <Box className={"rules-frame"}>
                    <h2 style={{ color: "#603809", marginBottom: "20px" }}>About Bean Scene</h2>
                    <p style={{ marginBottom: "15px" }}>
                      Bean Scene is a premium coffee shop dedicated to providing you with the highest quality coffee experience.
                      We believe that every cup of coffee should be exceptional, carefully selected from the finest beans around the world.
                    </p>
                    <h3 style={{ color: "#603809", marginTop: "30px", marginBottom: "15px" }}>Our Mission</h3>
                    <p style={{ marginBottom: "15px" }}>
                      To deliver exceptional coffee that enriches our customers' daily lives and supports sustainable coffee farming practices.
                      We are committed to quality, innovation, and creating a welcoming community for all coffee enthusiasts.
                    </p>
                    <h3 style={{ color: "#603809", marginTop: "30px", marginBottom: "15px" }}>Why Choose Bean Scene?</h3>
                    <ul style={{ marginBottom: "15px", paddingLeft: "20px" }}>
                      <li style={{ marginBottom: "10px" }}>
                        <strong>Supreme Beans:</strong> We source the finest coffee beans from premium coffee-growing regions worldwide
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <strong>High Quality:</strong> Our expert baristas ensure every cup is crafted to perfection
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <strong>Extraordinary Taste:</strong> Each blend offers a unique flavor experience you won't find anywhere else
                      </li>
                      <li style={{ marginBottom: "10px" }}>
                        <strong>Affordable Price:</strong> Premium quality doesn't have to be expensive
                      </li>
                    </ul>
                    <h3 style={{ color: "#603809", marginTop: "30px", marginBottom: "15px" }}>Contact Information</h3>
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Address:</strong> Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Phone:</strong> +1 202-918-2132
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Email:</strong> beanscene@mail.com
                    </p>
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Website:</strong> www.beanscene.com
                    </p>
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={"2"}>
                <Stack className={"rules-box"}>
                  <Box className={"rules-frame"}>
                    {terms.map((value, number) => {
                      return <p key={number}>{value}</p>;
                    })}
                  </Box>
                </Stack>
              </TabPanel>
              <TabPanel value={"3"}>
                <Stack className={"accordion-menu"}>
                  {faq.map((value, number) => {
                    return (
                      <Accordion key={number}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{value.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{value.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Stack>
              </TabPanel>
              <TabPanel value={"4"}>
                <Stack className={"admin-letter-box"}>
                  <Stack className={"admin-letter-container"}>
                    <Box className={"admin-letter-frame"}>
                      <span>Contact us!</span>
                      <p>Fill out below form to send a message!</p>
                    </Box>
                    <form
                      action={"#"}
                      method={"POST"}
                      className={"admin-letter-frame"}
                    >
                      <div className={"admin-input-box"}>
                        <label>Your name</label>
                        <input
                          type={"text"}
                          name={"memberNick"}
                          placeholder={"Type your name here"}
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Your email</label>
                        <input
                          type={"text"}
                          name={"memberEmail"}
                          placeholder={"Type your email here"}
                        />
                      </div>
                      <div className={"admin-input-box"}>
                        <label>Message</label>
                        <textarea
                          name={"memberMsg"}
                          placeholder={"Your message"}
                        ></textarea>
                      </div>
                      <Box
                        display={"flex"}
                        justifyContent={"flex-end"}
                        sx={{ mt: "30px" }}
                      >
                        <Button type={"submit"} variant="contained">
                          Send
                        </Button>
                      </Box>
                    </form>
                  </Stack>
                </Stack>
              </TabPanel>
            </Stack>
          </Stack>
        </TabContext>
      </Container>
    </div>
  );
}
