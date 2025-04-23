import {
  Card,
  Checkbox,
  Col,
  Row,
  Select,
  Typography,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { charts, grid, responsive, statistics } from "../data/data";

interface ControllerProps {
  settings: any;
  currentScreen: string;
  onSettingsChange: (settings: any) => void;
  setSelectionType: (type: string | null) => void;
  resetStats: () => void;
  resetCharts: () => void;
  onExportSettings: () => void;
}

const Controller = ({
  settings,
  currentScreen,
  onSettingsChange,
  setSelectionType,
  resetStats,
  resetCharts,
  onExportSettings,
}: ControllerProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedScreenSize, setSelectedScreenSize] = useState<string | null>(
    null
  );
  const [tempGrid, setTempGrid] = useState<number>(4);

  const gridOptions = grid.map((item) => ({
    value: item.value,
    label: item.title,
  }));

  const screenOptions = [
    { value: "default", label: "Default Settings" },
    ...responsive.map((item) => ({
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

    const newSettings = { ...settings };

    if (selectedScreenSize === "default") {
      // Update default settings
      newSettings.default[activeTab] = {
        visibleComponents: selectedComponents,
        defaultGrid: tempGrid,
      };
    } else {
      // Update screen-specific settings
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
        visibleComponents: selectedComponents,
        defaultGrid: tempGrid,
      };
    }

    onSettingsChange(newSettings);
    message.success(`Settings saved for ${selectedScreenSize}`);
    setActiveTab(null);
    setSelectionType(null);
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Component Selector</Typography.Title>
          <Typography.Text>Current Screen: {currentScreen}</Typography.Text>
        </Col>

        <Col span={12}>
          <Checkbox
            checked={activeTab === "stats"}
            onChange={(e) => {
              setActiveTab(e.target.checked ? "stats" : null);
              setSelectionType(e.target.checked ? "stats" : null);
            }}
          >
            Statistics
          </Checkbox>
          <Button type="link" onClick={resetStats} style={{ marginLeft: 8 }}>
            Reset Stats
          </Button>
        </Col>
        <Col span={12}>
          <Checkbox
            checked={activeTab === "charts"}
            onChange={(e) => {
              setActiveTab(e.target.checked ? "charts" : null);
              setSelectionType(e.target.checked ? "charts" : null);
            }}
          >
            Charts
          </Checkbox>
          <Button type="link" onClick={resetCharts} style={{ marginLeft: 8 }}>
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
