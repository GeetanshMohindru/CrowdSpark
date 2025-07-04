import React from 'react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="h-screen w-60 bg-white shadow flex flex-col p-4 gap-4">
      <Link to="/" className="font-bold text-xl mb-4">CrowdSpark</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/discovery">Discovery</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/notifications">Notifications</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </aside>
  );
} 