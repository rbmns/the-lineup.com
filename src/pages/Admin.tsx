
import React from 'react';
import CreatorRequests from '@/components/admin/CreatorRequests';

const Admin = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
      <CreatorRequests />
    </div>
  );
};

export default Admin;
