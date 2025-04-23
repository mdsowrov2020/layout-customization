import { useState, useEffect } from "react";
import Controller from "./components/Controller";
import Main from "./components/Main";
import { statistics, charts } from "@/pages/data/data";
import { Card } from "antd";

export default function Home() {
  const [visibleStats, setVisibleStats] = useState<string[]>(
    statistics.map((s) => s.id)
  );
  const [visibleCharts, setVisibleCharts] = useState<string[]>(
    charts.map((c) => c.id)
  );
  const [defaultStatsGrid, setDefaultStatsGrid] = useState<number>(4);
  const [defaultChartsGrid, setDefaultChartsGrid] = useState<number>(12);
  const [screenSize, setScreenSize] = useState<{
    min: number;
    max: number | null;
  } | null>(null);
  const [selectionType, setSelectionType] = useState<string | null>(null);
  const [jsonSettings, setJsonSettings] = useState<string>("");

  const resetStats = () => {
    setVisibleStats(statistics.map((s) => s.id));
    setDefaultStatsGrid(4);
    localStorage.removeItem("statsGridSettings");
    setSelectionType(null);
  };

  const resetCharts = () => {
    setVisibleCharts(charts.map((c) => c.id));
    setDefaultChartsGrid(12);
    localStorage.removeItem("chartsGridSettings");
    setSelectionType(null);
  };

  const handleExportSettings = (json: string) => {
    setJsonSettings(json);
  };

  useEffect(() => {
    const handleResize = () => {
      if (screenSize) {
        const width = window.innerWidth;
        if (
          width < screenSize.min ||
          (screenSize.max && width > screenSize.max)
        ) {
          console.warn("Window size outside selected screen range");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
      <Controller
        setDefaultStatsGrid={setDefaultStatsGrid}
        setDefaultChartsGrid={setDefaultChartsGrid}
        setVisibleStats={setVisibleStats}
        setVisibleCharts={setVisibleCharts}
        setScreenSize={setScreenSize}
        setSelectionType={setSelectionType}
        visibleStats={visibleStats}
        visibleCharts={visibleCharts}
        defaultStatsGrid={defaultStatsGrid}
        defaultChartsGrid={defaultChartsGrid}
        resetStats={resetStats}
        resetCharts={resetCharts}
      />
      <Main
        defaultStatsGrid={defaultStatsGrid}
        defaultChartsGrid={defaultChartsGrid}
        visibleStats={visibleStats}
        visibleCharts={visibleCharts}
        screenSize={screenSize}
        selectionType={selectionType}
        onExportSettings={handleExportSettings}
      />
      {jsonSettings && (
        <Card title="Current Settings JSON">
          <pre>{jsonSettings}</pre>
        </Card>
      )}
    </div>
  );
}
