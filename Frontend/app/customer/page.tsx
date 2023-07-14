"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Formik, Form, Field, FormikProps } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";

import {
  Avatar,
  Grid,
  IconButton,
  ListItemAvatar,
  Paper,
  Stack,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import GridViewIcon from "@mui/icons-material/GridView";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CommentIcon from "@mui/icons-material/Comment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { TextField } from "formik-material-ui";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useAppDispatch } from "@/store/store";
import {
  accessTokenSelector,
  isAuthenticatedSelector,
} from "@/store/slices/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { userSelector, getUserDatas } from "@/store/slices/userDataSlice";
import {
  addUser,
  getUserByID,
  updateUser,
  deleteUser,
} from "@/services/serverService";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { UserData } from "@/models/user.model";
import { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { ExpandMore } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import axios from "axios";

type Props = {
  dataUser?: UserData;
};

function getDataUser(id: string): any {}

export default function Page({ dataUser }: Props) {
  const [open, setOpen] = React.useState(false);
  const [switchLayout, setSwitchLayout] = useState("table");
  const [expanded, setExpanded] = React.useState(false);
  const [editAction, setEditAction] = React.useState(false);
  const [ediID, setEdiID] = React.useState("");

  const [initialValuesForm, setInitialValuesForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    birthdate: "",
  });

  const [value, setValue] = React.useState<Dayjs | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openList = Boolean(anchorEl);
  const actionBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseList = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useSelector(userSelector);

  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const accessToken = useSelector(accessTokenSelector);
  // axios.defaults.headers.common['Authorization'] = accessToken;
  if (isAuthenticated === false) {
    router.push(`/login`);
  }

  const phoneRegExp = /^02\d{8}$/;
  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required().email(),
    phone: yup
      .string()
      .max(10)
      .min(10)
      .required()
      .matches(phoneRegExp, "start with 02"),
    birthdate: yup
      .date()
      .required()
      .default(() => new Date()),
  });

  const editActionBtn = async () => {
    handleCloseList();
    const id = anchorEl?.attributes?.attrid?.value;
    setEdiID(id ? id : "");
    const result = await getUserByID(id);
    if (result.status) {
      setEditAction(true);
      setOpen(true);

      setInitialValuesForm({
        name: result.data.name ? result.data.name : "",
        address: result.data.address ? result.data.address : "",
        email: result.data.email ? result.data.email : "",
        phone: result.data.phone ? result.data.phone : "",
        birthdate: result.data.birthDate
          ? moment(result.data.birthDate).format("YYYY-MM-DD")
          : "",
      });
    } else {
    }
  };

  const deleteActionBtn = async () => {
    handleCloseList();
    const id = anchorEl?.attributes?.attrid?.value;
    setEdiID(id ? id : "");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteUser(id);
        if (response.data.status) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          dispatch(getUserDatas(""));
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
          });
        }
      }
    });
  };

  const addActionBtn = () => {
    setEditAction(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    dispatch(getUserDatas(""));
    console.log("effect");
  }, [dispatch]);

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
          name="name"
          margin="normal"
          required
          fullWidth
          label="Name"
          autoFocus
        />
        <Field
          component={TextField}
          name="address"
          margin="normal"
          required
          fullWidth
          label="Address"
        />
        <Field
          component={TextField}
          name="email"
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
        />
        <Field
          component={TextField}
          name="phone"
          margin="normal"
          required
          fullWidth
          label="Phone"
        />
        <Field
          component={TextField}
          name="birthdate"
          margin="normal"
          placeholder="2023-08-08"
          required
          fullWidth
          label="Birth Date"
        />
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Confirm</Button>
      </Form>
    );
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ backgroundColor: "#e5e5e5" }}
    >
      <div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openList}
          onClose={handleCloseList}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={editActionBtn}>
            <EditIcon /> Edit
          </MenuItem>
          <MenuItem onClick={deleteActionBtn}>
            <DeleteIcon /> Delete
          </MenuItem>
        </Menu>
      </div>
      <div>
        <Dialog open={open} fullWidth={true} onClose={handleClose}>
          <DialogTitle>Add/Edit</DialogTitle>
          <DialogContent>
            <React.Fragment>
              <Grid container spacing={2}>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                  <DialogContentText sx={{ color: "red" }}>
                    * Field mark is required
                  </DialogContentText>
                  <Formik
                    initialValues={initialValuesForm}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                      let data = new FormData();
                      if (ediID) {
                        data.append("id", String(ediID));
                      }
                      data.append("name", String(values.name));
                      data.append("address", String(values.address));
                      data.append("email", String(values.email));
                      data.append("phone", String(values.phone));
                      data.append("birthDate", String(values.birthdate));
                      // if (values.file) {
                      //   data.append("image", values.file);
                      // }
                      if (ediID) {
                        const response = await updateUser(data);
                        if (response.data.status) {
                          setOpen(false);
                          Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        } else {
                          Swal.fire(
                            "failed!",
                            response?.data?.message?.message,
                            "warning"
                          );
                        }
                      } else {
                        const response = await addUser(data);
                        if (response.data.status) {
                          setOpen(false);
                          Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        } else {
                          Swal.fire(
                            "failed!",
                            response?.data?.message?.message ||
                              response?.data?.message,
                            "warning"
                          );
                        }
                      }
                      dispatch(getUserDatas(""));
                    }}
                  >
                    {(props) => showForm(props)}
                  </Formik>
                </Grid>
              </Grid>
            </React.Fragment>
          </DialogContent>
        </Dialog>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          m: 1,
          borderRadius: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{ margin: "10px" }}
          onClick={addActionBtn}
        >
          <AddIcon /> Add Customer
        </Button>
        <Box>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setSwitchLayout("table")}
          >
            <TableRowsIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => setSwitchLayout("card")}
          >
            <GridViewIcon />
          </IconButton>
        </Box>
      </Box>
      {switchLayout === "card" ? (
        <Box>
          <Grid container spacing={3}>
            {userData &&
              userData.data?.map((value, index) => (
                <>
                  <Grid item xs={6}>
                    <Card sx={{ minHeight: 300 }}>
                      <CardHeader
                        action={
                          <IconButton
                            aria-label="settings"
                            attrid={value._id}
                            onClick={actionBtnClick}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        }
                      />
                      <CardContent sx={{ marginTop: -6 }}>
                        <Grid container>
                          <Grid item xs={4}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar sx={{ width: 100, height: 100 }}>
                                W
                              </Avatar>
                            </Stack>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#1991d9" }}
                            >
                              Name
                            </Typography>
                            <Typography variant="subtitle1">
                              {value.name || "-"}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#1991d9" }}
                            >
                              Address
                            </Typography>
                            <Typography variant="subtitle1">
                              {value.address || "-"}
                            </Typography>
                            <Box>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                              >
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: "#1991d9" }}
                                  >
                                    E-mail
                                  </Typography>
                                  <Typography variant="subtitle1">
                                    {value.email || "-"}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: "#1991d9" }}
                                  >
                                    Phone
                                  </Typography>
                                  <Typography variant="subtitle1">
                                    {value.phone || "-"}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                            <Typography
                              variant="subtitle1"
                              sx={{ color: "#1991d9" }}
                            >
                              Birth Date
                            </Typography>
                            <Typography variant="subtitle1">
                              {moment(value.birthDate).format("DD/MM/YYYY") ||
                                "-"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              ))}
          </Grid>
        </Box>
      ) : (
        <Box>
          <List sx={{ width: "100%" }}>
            <ListItem
              disableGutters
              secondaryAction={<></>}
              sx={{ padding: 1, marginX: 6, color: "blue" }}
            >
              <ListItemText primary={`Name`} />
              <ListItemText primary={`Address`} />
              <ListItemText primary={`Email`} />
              <ListItemText primary={`Phone`} />
              <ListItemText primary={`Birth Date`} />
            </ListItem>
            {userData &&
              userData.data?.map((value, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      aria-label="comment"
                      attrid={value._id}
                      onClick={actionBtnClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  sx={{
                    backgroundColor: "white",
                    marginY: "10px",
                    padding: 1,
                    borderRadius: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText primary={`${value.name || ""}`} />
                  <ListItemText primary={`${value.address || ""}`} />
                  <ListItemText primary={`${value.email || ""}`} />
                  <ListItemText primary={`${value.phone || ""}`} />
                  <ListItemText
                    primary={`${
                      moment(value.birthDate).format("DD/MM/YYYY") || ""
                    }`}
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id }: any = context.query;
  if (id) {
    const dataUser = await getUserByID(id);
    return {
      props: {
        dataUser,
      },
    };
  } else {
    return { props: {} };
  }
};
