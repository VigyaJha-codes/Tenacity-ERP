import { useEffect } from 'react';

const Index = () => {
  // Redirect to main app (this shouldn't be reached in normal flow)
  useEffect(() => {
    window.location.href = '/';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Tenacity ERP</h1>
        <p className="text-xl opacity-90">Loading Education Management System...</p>
      </div>
    </div>
  );
};

export default Index;
