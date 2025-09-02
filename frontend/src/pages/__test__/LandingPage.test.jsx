import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../LandingPage';

test('renders welcome message', () => {
  render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>
  );

  expect(screen.getByText(/Welcome to LawnHero/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
});