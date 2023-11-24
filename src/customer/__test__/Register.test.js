import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customerService } from '../../apiUrls';
import { MemoryRouter, navigate } from 'react-router-dom';
import Register from '../Register';

jest.mock('../../apiUrls', () => ({
  customerService: {
    registration: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  navigate: jest.fn(),
}));

describe('Register Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display validation errors when submitting an empty form', async () => {
    const { getByTestId, getByText } = render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.submit(getByTestId('registration-form'));

  })
  it('should call registration API and navigate to login on successful registration', async () => {
    const { getByTestId, getByLabelText } = render(<MemoryRouter><Register /></MemoryRouter>);

    fireEvent.change(getByLabelText("First Name"), { target: { value: 'John' } });
    fireEvent.change(getByLabelText("Last Name"), { target: { value: 'George' } });
    fireEvent.change(getByLabelText("Email"), { target: { value: 'john@gmail.com' } });
    fireEvent.change(getByLabelText("Phone"), { target: { value: '9823109822' } });
    fireEvent.change(getByLabelText("Address"), { target: { value: 'kochi' } });
    fireEvent.change(getByLabelText("Password"), { target: { value: 'john123' } });

    fireEvent.submit(getByTestId('registration-form'));

    // Simulate a successful registration response
    customerService.registration.mockResolvedValueOnce({
      data: 'successfully registered',
    });

 
})
it('should display error for First Name containing digits', async () => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  
  // Triggering the validation logic with a First Name containing digits
  userEvent.type(screen.getByLabelText("First Name"), 'John123');

  fireEvent.submit(screen.getByTestId('registration-form'));

  await waitFor(() => {
    expect(screen.getByText('First Name Should not contain digits')).toBeInTheDocument();
  });

 
});

it('should display error for Last Name containing digits', async () => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  
  // Triggering the validation logic with a First Name containing digits
  userEvent.type(screen.getByLabelText("Last Name"), '  ');

  fireEvent.submit(screen.getByTestId('registration-form'));

  await waitFor(() => {
    expect(screen.getByText('Last Name should not contain spaces')).toBeInTheDocument();
  });
})

})