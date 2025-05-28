
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from './MainNav';
import { Footer } from './ui/footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Layout = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
