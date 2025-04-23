import { useState, useEffect } from "react";
import Controller from "./components/Controller";
import Main from "./components/Main";
import { statistics, charts, responsive } from "@/pages/data/data";
import { Card } from "antd";

interface ScreenSettings {
  min: number;
  max: number | null;
  stats?: {
    visibleComponents?: string[];
    defaultGrid?: number;
    customGrids?: Record<string, number>;
  };
  charts?: {
    visibleComponents?: string[];
    defaultGrid?: number;
    customGrids?: Record<string, number>;
  };
}

interface AppSettings {
  default: {
    stats: {
      visibleComponents: string[];
      defaultGrid: number;
      customGrids: Record<string, number>;
    };
    charts: {
      visibleComponents: string[];
      defaultGrid: number;
      customGrids: Record<string, number>;
    };
  };
  screenSpecific: Record<string, ScreenSettings>;
}

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>({
    default: {
      stats: {
        visibleComponents: statistics.map((s) => s.id),
        defaultGrid: 4,
        customGrids: {},
      },
      charts: {
        visibleComponents: charts.map((c) => c.id),
        defaultGrid: 12,
        customGrids: {},
      },
    },
    screenSpecific: {},
  });

  const [currentScreen, setCurrentScreen] = useState<string>("desktop");
  const [jsonSettings, setJsonSettings] = useState<string>("");
  const [selectionType, setSelectionType] = useState<string | null>(null);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const screen =
        responsive.find((r) => width >= r.min && (!r.max || width <= r.max))
          ?.device || "desktop";
      setCurrentScreen(screen);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial detection
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get active settings for current screen
  const getActiveSettings = () => {
    const screenConfig = settings.screenSpecific[currentScreen] || {};
    return {
      stats: {
        ...settings.default.stats,
        ...(screenConfig.stats || {}),
        customGrids: {
          ...settings.default.stats.customGrids,
          ...(screenConfig.stats?.customGrids || {}),
        },
      },
      charts: {
        ...settings.default.charts,
        ...(screenConfig.charts || {}),
        customGrids: {
          ...settings.default.charts.customGrids,
          ...(screenConfig.charts?.customGrids || {}),
        },
      },
    };
  };

  const activeSettings = getActiveSettings();

  const handleGridChange = (
    type: "stats" | "charts",
    id: string,
    value: number
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev };

      // Update for current screen if it has specific settings
      if (newSettings.screenSpecific[currentScreen]?.[type]) {
        newSettings.screenSpecific[currentScreen][type] = {
          ...newSettings.screenSpecific[currentScreen][type],
          customGrids: {
            ...newSettings.screenSpecific[currentScreen][type]?.customGrids,
            [id]: value,
          },
        };
      } else {
        // Update default settings
        newSettings.default[type].customGrids[id] = value;
      }

      return newSettings;
    });
  };

  const resetStats = () => {
    setSettings((prev) => ({
      ...prev,
      default: {
        ...prev.default,
        stats: {
          visibleComponents: statistics.map((s) => s.id),
          defaultGrid: 4,
          customGrids: {},
        },
      },
    }));
    setSelectionType(null);
  };

  const resetCharts = () => {
    setSettings((prev) => ({
      ...prev,
      default: {
        ...prev.default,
        charts: {
          visibleComponents: charts.map((c) => c.id),
          defaultGrid: 12,
          customGrids: {},
        },
      },
    }));
    setSelectionType(null);
  };

  const handleExportSettings = () => {
    setJsonSettings(JSON.stringify(settings, null, 2));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
      <Controller
        settings={settings}
        currentScreen={currentScreen}
        onSettingsChange={setSettings}
        setSelectionType={setSelectionType}
        resetStats={resetStats}
        resetCharts={resetCharts}
        onExportSettings={handleExportSettings}
      />
      <Main
        activeSettings={activeSettings}
        selectionType={selectionType}
        currentScreen={currentScreen}
        onGridChange={handleGridChange}
      />
      {jsonSettings && (
        <Card title="Current Settings JSON">
          <pre>{jsonSettings}</pre>
        </Card>
      )}
    </div>
  );
}
