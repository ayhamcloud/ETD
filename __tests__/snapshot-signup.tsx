import { render } from '@testing-library/react'
import SignUp from '@/pages/signup'

it('renders signup unchanged', () => {
  const { container } = render(<SignUp />)
  expect(container).toMatchSnapshot()
})