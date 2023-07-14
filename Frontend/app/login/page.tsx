"use client";
import React from "react";
import { Formik, Form, Field, FormikProps } from "formik";
import { signIn } from "@/store/slices/userSlice";
import Button from "@mui/material/Button";
import { TextField } from "formik-material-ui";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Props = {};


export default function Page({}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const showForm = ({
    values,
    setFieldValue,
    isValid,
    dirty,
    handleSubmit,
  }: FormikProps<any>) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Field
          component={TextField}
          id="username"
          name="username"
          margin="normal"
          required
          fullWidth
          label="Username"
          autoComplete="email"
          autoFocus
        />
        <Field
          component={TextField}
          id="password"
          name="password"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Login
        </Button>
      </Form>
    );
  };
  return (
    <Container component="main" maxWidth="xs">
      <React.Fragment>
        <Box
          sx={{
            marginTop: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5%",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (values) => {
                const response = await dispatch(signIn(values));
                if (response.meta.requestStatus === "rejected") {
                  Swal.fire("Login failed!", response?.error?.message, "warning");
                } else {
                  router.push("/customer");
                }
              }}
            >
              {(props) => showForm(props)}
            </Formik>
          </Box>
        </Box>
      </React.Fragment>
    </Container>
  );
}
