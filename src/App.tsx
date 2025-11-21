import { Suspense, useEffect } from 'react';
import './assets/styles/index.scss'
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import GlobalLoader, { LoaderFallback } from './components/common/GlobalLoader';
import { eventBus } from './lib/eventBus';

const App = () => {
  
  useEffect(() => {
    const handler = (data: any) => console.log(data);
    eventBus.on("testEvent", handler);

    return () => {
      eventBus.off("testEvent", handler);
    };
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Suspense fallback={<LoaderFallback />}>
          <GlobalLoader />

          <button onClick={() => eventBus.emit("testEvent", { msg: "butona basildi" })}>xxxx</button>
        </Suspense>
      </ThemeProvider>
    </HelmetProvider>
  );
};


export default App
