import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ViewCustomer from '../ViewCustomer'
import { managerService } from '../../apiUrls';
import { axiosPrivate } from '../../interceptor';
import userEvent from '@testing-library/user-event';
jest.mock('../../apiUrls', () => ({
  managerService: {
    viewCustomer: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../interceptor', () => ({
  axiosPrivate: jest.fn(),
}));

describe('ViewStaff', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Clears all function mocks between tests
      });
  const mockStaffData1 = {
    results: [
      { id: 1, user_firstname: 'John', user_lastname: 'Doe', email: 'john.doe@example.com', phone: '555-1234', user_address: '123 Main St' },
      { id: 2, user_firstname: 'Jane', user_lastname: 'Doe', email: 'jane.doe@example.com', phone: '555-5678', user_address: '456 Oak St' },
    ],
    next_page: '/api/staff/?page=2',
    previous_page: null,
  };

  const mockStaffData2 = {
    results: [
      { id: 3, user_firstname: 'Anil', user_lastname: 'Doe', email: 'john.doe@example.com', phone: '555-1234', user_address: '123 Main St' },
      { id: 4, user_firstname: 'Sanil', user_lastname: 'Doe', email: 'jane.doe@example.com', phone: '555-5678', user_address: '456 Oak St' }, 
    ],
    next_page: '/api/transactions/?page=3',
    previous_page: '/api/transactions/?page=1',
  };

  it('fetches and displays staff data on mount', async () => {
    managerService.viewCustomer.mockResolvedValueOnce({
      data: mockStaffData1,
    });

    render(
      <MemoryRouter initialEntries={['/view-staff']}>
        <Routes>
          <Route path="/view-staff" element={<ViewCustomer />} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => expect(managerService.viewCustomer).toHaveBeenCalledTimes(1));

    
  });
  it('handles pagination on button click', async () => {
    managerService.viewCustomer.mockResolvedValueOnce({
      data: mockStaffData1,
    });
    managerService.viewCustomer.mockResolvedValueOnce({
      data: mockStaffData2,
    });

   

    render(
      <MemoryRouter initialEntries={['/view-staff']}>
        <Routes>
          <Route path="/view-staff" element={<ViewCustomer />} />
        </Routes>
      </MemoryRouter>
    );

    
    await waitFor(() => expect(managerService.viewCustomer).toHaveBeenCalledTimes(1));
    await waitFor(() => {

      expect(screen.getByText('John')).toBeInTheDocument()

    });
   
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
   
    await waitFor(() => expect(managerService.viewCustomer).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Jane')).toBeInTheDocument()

    await waitFor(() =>{

      const buttons = screen.getAllByTestId('update');
          
      const button = buttons[0];
      userEvent.click(button);
      
  })

  await waitFor(() =>{

    const buttons = screen.getAllByTestId('view');
        
    const button = buttons[0];
    userEvent.click(button);
    
})
  expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/manager/updatecustomer'), expect.any(Object));


  await waitFor(() =>{

    const buttons = screen.getAllByTestId('previous');
        
    const button = buttons[0];
    userEvent.click(button);
    
})
    await waitFor(() => expect(managerService.viewCustomer).toHaveBeenCalledTimes(1));
   
  });

 })