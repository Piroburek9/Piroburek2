import React, { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Router } from './components/Router';
import { Toaster } from './components/ui/sonner';
import { Footer } from './components/layout/Footer';

function App() {
  useEffect(() => {
    // Signal that React app has loaded
    window.parent.postMessage('react-app-loaded', '*');
    
    // Initialize backend data
    const initializeBackend = async () => {
      try {
        const response = await fetch('/api/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Backend initialized successfully');
        }
      } catch (error) {
        // Silent in dev, server might not be running
      }
    };
    
    initializeBackend();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[linear-gradient(180deg,theme(colors.white)_0%,theme(colors.slate.50)_100%)] text-foreground relative overflow-hidden">
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-grid opacity-[0.15]" />
            <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
            <div className="absolute -bottom-32 left-8 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/5 blur-3xl" />
            <div className="absolute top-1/3 -right-20 h-[30rem] w-[30rem] rounded-full bg-indigo-500/5 blur-3xl" />
          </div>
          <Router />

          <Toaster 
            position="top-right" 
            expand={true}
            richColors={false}
            closeButton={true}
            toastOptions={{
              style: {
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)'
              },
              className: 'text-gray-900',
            }}
          />

          {/* Global Loading Overlay for Network Requests */}
          <div id="global-loading" className="fixed inset-0 bg-black/30 z-50 hidden items-center justify-center">
            <div className="rounded-xl p-6 shadow-xl bg-white border">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-gray-800">Загрузка...</span>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;