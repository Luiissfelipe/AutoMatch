import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../features/auth/pages/Login';
import { SignUp } from '../features/auth/pages/SignUp';
import { Search } from '../features/cars/pages/Search/Search';
import { Recommended } from '../features/cars/pages/Recommended/Recommended';
import { Favorites } from '../features/cars/pages/Favorites/Favorites';
import { CarDetails } from '../features/cars/pages/CarDetails/CarDetails';
import { EditListing } from '../features/cars/pages/EditListing/EditListing';
import { Profile } from '../features/profile/pages/Profile';

export function AppRoutes({ isAuthenticated }) {
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/search" element={<Search />} />
      <Route path="/recommended" element={<Recommended />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/car/:id" element={<CarDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-ad/:id" element={<EditListing />} />
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  );
}
