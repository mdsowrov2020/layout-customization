import {
  Button,
  Card,
  Checkbox,
  Col,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { charts, grid, responsive, statistics } from "../../lib/data/data";
import {
  AppSettings,
  ResponsiveBreakpoint,
  GridOption,
} from "@/lib/model/type";

interface ControllerProps {
  settings: AppSettings;
  currentScreen: string;
  onSettingsChange: (settings: AppSettings) => void;
  setSelectionType: (type: "stats" | "charts" | null) => void;
  resetStats: () => void;
  resetCharts: () => void;
  resetAll: () => void;
  onExportSettings: () => void;
}

const Controller: React.FC<ControllerProps> = ({
  settings,
  currentScreen,
  onSettingsChange,
  setSelectionType,
  resetStats,
  resetCharts,
  resetAll,
  onExportSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"stats" | "charts" | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<number[]>([]); // Changed to number[]
  const [selectedScreenSize, setSelectedScreenSize] =
    useState<string>("default");
  const [tempGrid, setTempGrid] = useState<number>(4);

  const gridOptions: GridOption[] = grid.map((item) => ({
    id: item.id,
    value: item.value,
    title: item.title,
    label: item.title, // Optional, for Select components
  }));

  const screenOptions = [
    { value: "default", label: "Default Settings" },
    ...responsive.map((item: ResponsiveBreakpoint) => ({
      value: item.device,
      label: `${item.device} (${item.min}-${item.max || "∞"}px)`,
    })),
  ];

  useEffect(() => {
    if (activeTab === "stats") {
      setSelectedComponents(
        selectedScreenSize === "default"
          ? settings.default.stats.visibleComponents
          : settings.screenSpecific[selectedScreenSize]?.stats
              ?.visibleComponents || settings.default.stats.visibleComponents
      );
      setTempGrid(
        selectedScreenSize === "default"
          ? settings.default.stats.defaultGrid
          : settings.screenSpecific[selectedScreenSize]?.stats?.defaultGrid ||
              settings.default.stats.defaultGrid
      );
    } else if (activeTab === "charts") {
      setSelectedComponents(
        selectedScreenSize === "default"
          ? settings.default.charts.visibleComponents
          : settings.screenSpecific[selectedScreenSize]?.charts
              ?.visibleComponents || settings.default.charts.visibleComponents
      );
      setTempGrid(
        selectedScreenSize === "default"
          ? settings.default.charts.defaultGrid
          : settings.screenSpecific[selectedScreenSize]?.charts?.defaultGrid ||
              settings.default.charts.defaultGrid
      );
    }
  }, [activeTab, selectedScreenSize, settings]);

  const handleSaveSettings = () => {
    if (!activeTab || !selectedScreenSize) {
      message.warning("Please select both a component type and screen size");
      return;
    }

    const newSettings: AppSettings = { ...settings };

    if (selectedScreenSize === "default") {
      newSettings.default[activeTab] = {
        ...newSettings.default[activeTab],
        visibleComponents: selectedComponents,
        defaultGrid: tempGrid,
        // Keep existing customGrids
        customGrids: newSettings.default[activeTab].customGrids,
      };
    } else {
      if (!newSettings.screenSpecific[selectedScreenSize]) {
        const screenConfig = responsive.find(
          (r) => r.device === selectedScreenSize
        );
        newSettings.screenSpecific[selectedScreenSize] = {
          min: screenConfig?.min || 0,
          max: screenConfig?.max || null,
        };
      }

      newSettings.screenSpecific[selectedScreenSize][activeTab] = {
        ...newSettings.screenSpecific[selectedScreenSize]?.[activeTab],
        visibleComponents: selectedComponents,
        defaultGrid: tempGrid,
        // Keep existing customGrids or initialize if not exists
        customGrids:
          newSettings.screenSpecific[selectedScreenSize]?.[activeTab]
            ?.customGrids || {},
      };
    }

    onSettingsChange(newSettings);
    message.success(`Settings saved for ${selectedScreenSize}`);
    setActiveTab(null);
    setSelectionType(null);
  };

  const handleReset = (type: "stats" | "charts") => {
    if (type === "stats") {
      resetStats();
      setSelectedComponents(statistics.map((s) => s.id));
      setTempGrid(4);
    } else {
      resetCharts();
      setSelectedComponents(charts.map((c) => c.id));
      setTempGrid(12);
    }
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Component Selector</Typography.Title>
          <Typography.Text>Current Screen: {currentScreen}</Typography.Text>
          <Button
            type="link"
            onClick={resetAll}
            style={{ marginLeft: 16 }}
            danger
          >
            Reset All Settings
          </Button>
        </Col>

        <Col span={12}>
          <Checkbox
            checked={activeTab === "stats"}
            onChange={(e) => {
              setActiveTab(e.target.checked ? "stats" : null);
              setSelectionType(e.target.checked ? "stats" : null);
              // Initialize with all stats components when selected
              setSelectedComponents(statistics.map((s) => s.id));
              setTempGrid(4);
            }}
          >
            Statistics
          </Checkbox>
          <Button
            type="link"
            onClick={() => {
              resetStats();
              // Force update UI to show all stats immediately
              setSelectedComponents(statistics.map((s) => s.id));
              setTempGrid(4);
            }}
            style={{ marginLeft: 8 }}
            danger
          >
            Reset Stats
          </Button>
        </Col>
        <Col span={12}>
          <Checkbox
            checked={activeTab === "charts"}
            onChange={(e) => {
              setActiveTab(e.target.checked ? "charts" : null);
              setSelectionType(e.target.checked ? "charts" : null);
              // Initialize with all charts components when selected
              setSelectedComponents(charts.map((c) => c.id));
              setTempGrid(12);
            }}
          >
            Charts
          </Checkbox>
          <Button
            type="link"
            onClick={() => {
              resetCharts();
              // Force update UI to show all charts immediately
              setSelectedComponents(charts.map((c) => c.id));
              setTempGrid(12);
            }}
            style={{ marginLeft: 8 }}
            danger
          >
            Reset Charts
          </Button>
        </Col>

        <Col span={24}>
          <Typography.Text strong>Apply Settings For</Typography.Text>
          <Select
            options={screenOptions}
            onChange={setSelectedScreenSize}
            value={selectedScreenSize}
            style={{ width: "100%", marginTop: 8 }}
          />
        </Col>

        {activeTab && (
          <>
            <Col span={24}>
              <Typography.Text strong>
                Select {activeTab === "stats" ? "Statistics" : "Charts"} to Show
              </Typography.Text>
              <Select
                mode="multiple"
                options={
                  activeTab === "stats"
                    ? statistics.map((s) => ({ value: s.id, label: s.name }))
                    : charts.map((c) => ({ value: c.id, label: c.name }))
                }
                value={selectedComponents}
                onChange={setSelectedComponents}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>

            <Col span={24}>
              <Typography.Text strong>
                {activeTab === "stats" ? "Statistics" : "Charts"} Grid Layout
              </Typography.Text>
              <Select
                options={gridOptions}
                value={tempGrid}
                onChange={setTempGrid}
                style={{ width: "100%", marginTop: 8 }}
              />
            </Col>
          </>
        )}

        <Col span={24}>
          <Button
            type="primary"
            onClick={handleSaveSettings}
            style={{ width: "100%", marginBottom: 16 }}
            disabled={!activeTab || !selectedScreenSize}
          >
            Save Settings
          </Button>
          <Button onClick={onExportSettings} style={{ width: "100%" }}>
            Export All Settings
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Controller;
