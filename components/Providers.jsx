'use client';

import OptionContextProvider from "@/store/option-context";


export default function Providers({ children }) {
  return (
      <OptionContextProvider>
            {children}
      </OptionContextProvider>
        
  );
}