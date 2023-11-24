import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Logout from '../Logout';

describe('Logout', () => {

 test('handles redirect when token exists', () => {
   
    const fakeToken = 'your-fake-token';
    localStorage.setItem('tokens', fakeToken);
  
    
    const navigateMock = jest.fn();
  
  
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );
});
})
