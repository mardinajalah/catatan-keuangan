import React, { createContext, useContext, useMemo, useState } from 'react';

type HomeTabContextValue = {
  activeHomeTab: number;
  setActiveHomeTab: (tab: number) => void;
};

const HomeTabContext = createContext<HomeTabContextValue | null>(null);

export const HomeTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeHomeTab, setActiveHomeTab] = useState(0);

  const value = useMemo(
    () => ({
      activeHomeTab,
      setActiveHomeTab,
    }),
    [activeHomeTab],
  );

  return <HomeTabContext.Provider value={value}>{children}</HomeTabContext.Provider>;
};

export const useHomeTab = () => {
  const context = useContext(HomeTabContext);

  if (!context) {
    throw new Error('useHomeTab must be used inside HomeTabProvider');
  }

  return context;
};
