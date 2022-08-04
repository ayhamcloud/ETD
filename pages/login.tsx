import SignIn from "../components/SignIn";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "../utils/Store";

export default function Login() {
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { next } = router.query as { next: string };

  return (
    <SignIn
      forgotPassword="Forgot password?"
      title="ETD - Sign In"
      metaDescription="Sign in to ETD"
      noAccountYet=" Don't have an account? Sign Up"
      next={next}
      router={router}
      dispatch={dispatch}
    />
  );
}
