export interface GridSettings {
  visibleComponents: number[]; // Changed to number[] to match your data
  defaultGrid: number;
  customGrids: Record<number, number>; // Changed to number keys
}

export interface ScreenSettings {
  min: number;
  max: number | null;
  stats?: Partial<GridSettings>;
  charts?: Partial<GridSettings>;
}

export interface AppSettings {
  default: {
    stats: GridSettings;
    charts: GridSettings;
  };
  screenSpecific: Record<string, ScreenSettings>;
}

export interface Statistic {
  id: number;
  name: string;
  grid: number;
  component: React.ReactNode;
}

export interface Chart {
  id: number;
  name: string;
  grid: number;
  component: React.ReactNode;
}

export interface GridOption {
  id: number;
  value: number;
  title: string;
}

export interface ResponsiveBreakpoint {
  id: number;
  device: string;
  min: number;
  max: number | null;
}
