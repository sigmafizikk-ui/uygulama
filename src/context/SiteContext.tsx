import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sites } from '@/utils/mockData';

export interface Site {
  id: string;
  name: string;
  address: string;
  totalBlocks: number;
  totalApartments: number;
  management: {
    president: string;
    phone: string;
    email: string;
  };
}

interface SiteContextType {
  currentSite: Site;
  setSite: (siteId: string) => void;
  availableSites: Site[];
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currentSite, setCurrentSite] = useState<Site>(sites[0]);

  const setSite = (siteId: string) => {
    const site = sites.find((s) => s.id === siteId);
    if (site) {
      setCurrentSite(site);
    }
  };

  const value: SiteContextType = {
    currentSite,
    setSite,
    availableSites: sites,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
