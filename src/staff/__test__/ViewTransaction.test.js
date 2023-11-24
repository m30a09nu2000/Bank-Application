import React from 'react';
import { render, screen, waitFor ,fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import viewTransaction from '../ViewTransaction'
import { staffService } from '../../apiUrls';
import { axiosPrivate } from '../../interceptor';
import ViewTransaction from '../ViewTransaction';

jest.mock('../../apiUrls', () => ({
  staffService: {
    viewTransaction: jest.fn(),
    downloadStaffManagerTransactionHistory: jest.fn(),
  },
}));

jest.mock('../../interceptor', () => ({
  axiosPrivate: jest.fn(),
}));

describe('TransactionView', () => {
  const mockLocationState = '12345';

  const mockTransactionDataPage1 = {
    results: [
      { id: 1, transaction_type: 'Credit', amount: 100, balance: 500, timestamp: '2023-01-01' },
      { id: 2, transaction_type: 'Debit', amount: 50, balance: 450, timestamp: '2023-01-02' },
    ],
    next_page: '/api/transactions/?page=2',
    previous_page: null,
  };
  const mockTransactionDataPage2 = {
    results: [
      { id: 3, transaction_type: 'Credit', amount: 75, balance: 525, timestamp: '2023-01-03' },
      { id: 4, transaction_type: 'Debit', amount: 30, balance: 495, timestamp: '2023-01-04' },
    ],
    next_page: '/api/transactions/?page=3',
    previous_page: '/api/transactions/?page=1',
  };


  beforeEach(() => {
    staffService.viewTransaction
      .mockResolvedValueOnce({ data: mockTransactionDataPage1 })
      .mockResolvedValueOnce({ data: mockTransactionDataPage2 });
  });

  it('renders TransactionView component', () => {
    render(
      <MemoryRouter initialEntries={['/transaction-view']}>
        <Routes>
          <Route path="/transaction-view" element={<ViewTransaction />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
  });

  it('fetches and displays transaction data on mount', async () => {
    

    render(
      <MemoryRouter initialEntries={[{ pathname: '/transaction-view', state: mockLocationState }]}>
        <Routes>
          <Route path="/transaction-view" element={<ViewTransaction />} />
        </Routes>
      </MemoryRouter>
    );

    
    await waitFor(() => {
      expect(staffService.viewTransaction).toHaveBeenCalledWith({
        account_number: mockLocationState,
      });
      expect(screen.getByText('Credit')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    });
 
 fireEvent.click(screen.getByText('Next'));

 
 await waitFor(() => {
   expect(staffService.viewTransaction).toHaveBeenCalledWith({
     account_number: mockLocationState,
     
   });

  
   
  });
  fireEvent.click(screen.getByText('Previous'));
  await waitFor(() => {
   expect(staffService.viewTransaction).toHaveBeenCalledWith({
     account_number: mockLocationState,
     
   });
  })
})
  it('renders TransactionView component with no transactions found', async () => {
   
    staffService.viewTransaction.mockResolvedValueOnce({
      data: 'Transaction not exist',
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/transaction-view', state: mockLocationState }]}>
        <Routes>
          <Route path="/transaction-view" element={<ViewTransaction />} />
        </Routes>
      </MemoryRouter>
    );

   
    await waitFor(() => {
      expect(staffService.viewTransaction).toHaveBeenCalledWith({
        account_number: mockLocationState,
      });
    });

    
   
  });

  it('handles pagination on button click', async () => {
    
    axiosPrivate.mockResolvedValueOnce({
      data: {
        results: [
          { id: 3, transaction_type: 'Credit', amount: 200, balance: 700, timestamp: '2023-01-03' },
        ],
        next_page: '/api/transactions/?page=3',
        previous_page: '/api/transactions/?page=1',
      },
    });

    

    render(
      <MemoryRouter initialEntries={[{ pathname: '/transaction-view', state: mockLocationState }]}>
        <Routes>
          <Route path="/transaction-view" element={<ViewTransaction />} />
        </Routes>
      </MemoryRouter>
    );


    
  

   
    
 
  });

  it('downloads transaction history on button click', async () => {
    staffService.downloadStaffManagerTransactionHistory.mockResolvedValueOnce({
      status: 200,
      data: 'download successfully',
    });
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const createObjectURLMock = jest.fn(() => 'mockedURL');
    const originalCreateObjectURL = window.URL.createObjectURL;
    window.URL.createObjectURL = createObjectURLMock;

    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
   
  
    render(
      <MemoryRouter initialEntries={[{ pathname: '/transaction-view', state: mockLocationState }]}>
        <Routes>
          <Route path="/transaction-view" element={<ViewTransaction />} />
        </Routes>
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Download/i }));
  
    await waitFor(() => {
      expect(staffService.downloadStaffManagerTransactionHistory).toHaveBeenCalledWith({
        account_number: mockLocationState,
      });
      expect(appendChildSpy).toHaveBeenCalled();
    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    
    window.URL.createObjectURL = originalCreateObjectURL;
    });
  
   
  });

 
 })
