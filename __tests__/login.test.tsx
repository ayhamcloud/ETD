import { render, screen } from '@testing-library/react'
import SignIn from '@/components/SignIn'

describe('Login', () => {
  it('renders Login',async () => {
    render(<SignIn forgotPassword="Forgot password?" title="ETD - Sign In" metaDescription="Sign in to ETD" noAccountYet="Don't have an account? Sign Up" next={null} router={null} dispatch={undefined}/>)

    const forgotPassword = screen.getByText("Forgot password?");
    const noAccountYet = screen.getByText("Don't have an account? Sign Up");

    expect(forgotPassword).toBeInTheDocument()
    expect(noAccountYet).toBeInTheDocument()
  })
})