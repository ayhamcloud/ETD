import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";

export default function DeleteDialog(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { onClose, open, id, url, setFetchAgainHandler } = props;
  const what = url?.includes("exercises") ? true : false;
  const router = useRouter();

  const handleClose = () => {
    onClose(open);
  };

  async function handleSubmit(id, url) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    if (response.status !== 200) {
      enqueueSnackbar(`Error deleting ${what ? "exercise" : "workout"}`, {
        variant: "error",
      });
      return;
    }
    what ? setFetchAgainHandler() : router.push("/sessions");
    enqueueSnackbar(`${what ? "Exercise" : "Workout"} deleted`, {
      variant: "success",
    });
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Formik
        initialValues={{ search: "" }}
        onSubmit={() => {
          handleSubmit(id, url);
        }}
      >
        {({ values, errors }) => (
          <Form>
            <DialogTitle id="alert-dialog-title">
              {`Are you sure you want to delete this ${
                what ? "Exercise" : "Workout"
              }?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be Undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                No
              </Button>
              <Button
                sx={{
                  color: "red",
                }}
                type="submit"
                onClick={handleClose}
              >
                Yes
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
