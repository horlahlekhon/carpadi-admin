import styled from "styled-components";
import { t } from "../../styles/theme.config";
import Card from "@mui/material/Card";
import { CardContent, Checkbox, TextField, Typography } from "@mui/material";
import Image from "next/image";
import classes from "../../styles/Auth.module.css";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import Button from "../../components/shared/Button";

function LoginPage() {
  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  return (
    <Container>
      <ImageBg>
        <PhoneImage src={"/auth/phone.png"}></PhoneImage>
      </ImageBg>
      <FormContainer>
        <div>
          <Typography mb={2} color={t.grey} fontWeight={500}>
            Admin Portal
          </Typography>
          <Card
            variant="outlined"
            sx={{ width: "437px", height: "566px", borderRadius: "12px" }}
          >
            <CardContent className={classes.centered}>
              <Image
                src={"/logos/blue-full.png"}
                width="300px"
                height="114px"
              ></Image>

              <TextField
                id="standard-basic"
                label="Email Address"
                variant="standard"
                type="email"
                sx={{ width: "372px", marginTop: "20px" }}
              />

              <FormControl
                sx={{ width: "372px", marginTop: "41px" }}
                variant="standard"
              >
                <InputLabel htmlFor="standard-adornment-password">
                  Password
                </InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <RememberMe>
                <Checkbox></Checkbox>
                <Typography>Remember Me</Typography>
              </RememberMe>
              <ReCAPTCHA
                sitekey="6LcIFiAgAAAAAO5J1kPxk306OqFVPaUUiDesLsG5"
                onChange={onCaptchaChange}
                size="normal"
              />
              <Button text="Login" />
            </CardContent>
          </Card>
        </div>
      </FormContainer>
    </Container>
  );
}

export default LoginPage;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${t.liteGrey};
  display: flex;
  flex-direction: row;
`;

const PhoneImage = styled.img`
  height: 759px;
  width: 441px;
  margin: auto;
`;

const ImageBg = styled.div`
  width: 48%;
  height: 100%;
  background-image: url("/auth/vector.png");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 52%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RememberMe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${t.lightGrey};
  justify-content: start;
  margin-top: 18px;
  margin-bottom: 32px;
`;
