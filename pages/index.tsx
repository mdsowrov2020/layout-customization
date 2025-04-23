import { useState, useEffect } from "react";
import Controller from "./components/Controller";
import Main from "./components/Main";
import { statistics, charts, responsive } from "@/pages/data/data";
import { Card, message } from "antd";
import { AppSettings, ResponsiveBreakpoint } from "./model/type";

const defaultSettings: AppSettings = {
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
};

export default function Home() {
  const [settings, setSettings] = useState<AppSettings>(
    JSON.parse(JSON.stringify(defaultSettings))
  );
  const [currentScreen, setCurrentScreen] = useState<string>("desktop");
  const [jsonSettings, setJsonSettings] = useState<string>("");
  const [selectionType, setSelectionType] = useState<"stats" | "charts" | null>(
    null
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const screen =
        responsive.find((r) => width >= r.min && (!r.max || width <= r.max))
          ?.device || "desktop";
      setCurrentScreen(screen);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    id: number, // Changed from string to number
    value: number
  ) => {
    setSettings((prev) => {
      const newSettings = { ...prev };

      if (newSettings.screenSpecific[currentScreen]?.[type]) {
        newSettings.screenSpecific[currentScreen][type] = {
          ...newSettings.screenSpecific[currentScreen][type],
          customGrids: {
            ...newSettings.screenSpecific[currentScreen][type]?.customGrids,
            [id]: value, // Now using number as key
          },
        };
      } else {
        newSettings.default[type].customGrids[id] = value; // Now using number as key
      }

      return newSettings;
    });
  };
  const resetAllSettings = () => {
    setSettings(JSON.parse(JSON.stringify(defaultSettings)));
    setSelectionType(null);
    message.success("All settings reset to default");
  };
  const resetStats = () => {
    setSettings((prev: AppSettings) => {
      const newSettings: AppSettings = {
        ...prev,
        default: {
          ...prev.default,
          stats: {
            visibleComponents: statistics.map((s) => s.id), // Now correctly number[]
            defaultGrid: 4,
            customGrids: {},
          },
        },
        screenSpecific: { ...prev.screenSpecific },
      };

      // Clean up screen-specific stats settings
      Object.entries(newSettings.screenSpecific).forEach(
        ([screen, screenSettings]) => {
          if (screenSettings.stats) {
            newSettings.screenSpecific[screen] = {
              ...screenSettings,
              stats: {
                ...screenSettings.stats,
                visibleComponents: undefined,
                defaultGrid: undefined,
                customGrids: {},
              },
            };
          }
        }
      );

      return newSettings;
    });
    setSelectionType(null);
    message.success("Statistics reset - showing all components");
  };

  const resetCharts = () => {
    setSettings((prev: AppSettings) => {
      const newSettings: AppSettings = {
        ...prev,
        default: {
          ...prev.default,
          charts: {
            visibleComponents: charts.map((c) => c.id), // Now correctly number[]
            defaultGrid: 12,
            customGrids: {},
          },
        },
        screenSpecific: { ...prev.screenSpecific },
      };

      // Clean up screen-specific charts settings
      Object.entries(newSettings.screenSpecific).forEach(
        ([screen, screenSettings]) => {
          if (screenSettings.charts) {
            newSettings.screenSpecific[screen] = {
              ...screenSettings,
              charts: {
                ...screenSettings.charts,
                visibleComponents: undefined,
                defaultGrid: undefined,
                customGrids: {},
              },
            };
          }
        }
      );

      return newSettings;
    });
    setSelectionType(null);
    message.success("Charts reset - showing all components");
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
        resetAll={resetAllSettings}
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
