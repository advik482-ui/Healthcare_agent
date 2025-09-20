import React from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100">
      <Sidebar />
      <main className="ml-20 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f0f0f0',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#4ADE80',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#F87171',
              secondary: '#1e293b',
            },
          },
        }}
      />
    </div>
  );
};