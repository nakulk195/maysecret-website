import React from 'react';
import { render, screen } from '@testing-library/react';
import FoundersNote from './FoundersNote';

describe('FoundersNote', () => {
  it('renders the founder note heading, signature, and premium value cards', () => {
    render(<FoundersNote />);

    expect(screen.getByText(/FOUNDER'S NOTE/i)).toBeInTheDocument();
    expect(screen.getByText(/More Than Skincare/i)).toBeInTheDocument();
    expect(screen.getByText(/Adv\. Prasanna/i)).toBeInTheDocument();
    expect(screen.getByText(/Korean Beauty Inspired/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality You Can Trust/i)).toBeInTheDocument();
  });
});
