// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2a2a72;
  color: #ffffff;
`;

const NavLinks = styled.div`
  a {
    margin: 0 1rem;
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    &:hover {
      color: #e9c46a;
    }
  }
`;

function Navbar() {
  return (
    <NavbarContainer>
      <h1>AR Museum</h1>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        <Link to="/team">Team</Link>
      </NavLinks>
    </NavbarContainer>
  );
}

export default Navbar;
