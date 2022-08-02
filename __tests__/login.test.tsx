import { render, screen } from '@testing-library/react'
import SignIn from '@/components/SignIn'

describe('Login', () => {
  it('renders Login',async () => {
    render(<SignIn forgotPassword="Forgot password?" title="ETD - Sign In" metaDescription="Sign in to ETD" noAccountYet=" Don&apos;t have an account? Sign Up" next={null} router={null}/>)

    const forgotPassword = screen.getByText("Forgot password?");
    const noAccountYet = screen.getByText(" Don&apos;t have an account? Sign Up");

    expect(forgotPassword).toBeInTheDocument()
  })
})