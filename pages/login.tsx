import SignIn from "../components/SignIn";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { next } = router.query as any;

  return(
    <SignIn forgotPassword="Forgot password?" title="ETD - Sign In" metaDescription="Sign in to ETD" noAccountYet=" Don't have an account? Sign Up" next={next} router={router}/>
  )
}
