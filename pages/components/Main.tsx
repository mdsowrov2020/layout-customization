import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { statistics, charts } from "@/pages/data/data";
import CustomGridSelect from "./CustomGridSelect";

interface MainProps {
  defaultStatsGrid: number;
  defaultChartsGrid: number;
  visibleStats: string[];
  visibleCharts: string[];
  screenSize: { min: number; max: number | null } | null;
  selectionType: string | null;
  onExportSettings: (json: string) => void;
}

const Main = ({
  defaultStatsGrid,
  defaultChartsGrid,
  visibleStats,
  visibleCharts,
  screenSize,
  selectionType,
  onExportSettings,
}: MainProps) => {
  const [statsGrids, setStatsGrids] = useState<Record<string, number>>({});
  const [chartsGrids, setChartsGrids] = useState<Record<string, number>>({});
  const [selectedCard, setSelectedCard] = useState<{
    id: string;
    type: "stats" | "charts";
  } | null>(null);

  // Load saved grid settings
  useEffect(() => {
    const loadSettings = (key: string) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    };

    setStatsGrids(loadSettings("statsGridSettings"));
    setChartsGrids(loadSettings("chartsGridSettings"));
  }, []);

  // Reset individual card grids when the main grid changes
  useEffect(() => {
    const resetIndividualGrids = () => {
      const newStatsGrids = { ...statsGrids };
      const newChartsGrids = { ...chartsGrids };

      Object.keys(newStatsGrids).forEach((id) => {
        newStatsGrids[id] = defaultStatsGrid;
      });
      Object.keys(newChartsGrids).forEach((id) => {
        newChartsGrids[id] = defaultChartsGrid;
      });

      setStatsGrids(newStatsGrids);
      setChartsGrids(newChartsGrids);
      localStorage.setItem("statsGridSettings", JSON.stringify(newStatsGrids));
      localStorage.setItem(
        "chartsGridSettings",
        JSON.stringify(newChartsGrids)
      );
    };

    resetIndividualGrids();
  }, [defaultStatsGrid, defaultChartsGrid]);

  const handleCardClick = (id: string, type: "stats" | "charts") => {
    if (!selectionType || selectionType === type) {
      setSelectedCard((prev) =>
        prev?.id === id && prev.type === type ? null : { id, type }
      );
    }
  };

  const handleLayoutChange = (value: number) => {
    if (!selectedCard) return;

    if (selectedCard.type === "stats") {
      const newGrids = { ...statsGrids, [selectedCard.id]: value };
      setStatsGrids(newGrids);
      localStorage.setItem("statsGridSettings", JSON.stringify(newGrids));
    } else {
      const newGrids = { ...chartsGrids, [selectedCard.id]: value };
      setChartsGrids(newGrids);
      localStorage.setItem("chartsGridSettings", JSON.stringify(newGrids));
    }

    setSelectedCard(null);
  };

  const generateSettingsJson = () => {
    return JSON.stringify(
      {
        settings: {
          stats: {
            visibleComponents: visibleStats,
            defaultGrid: defaultStatsGrid,
            customGrids: statsGrids,
          },
          charts: {
            visibleComponents: visibleCharts,
            defaultGrid: defaultChartsGrid,
            customGrids: chartsGrids,
          },
          screenSize: screenSize,
        },
      },
      null,
      2
    );
  };

  const handleExportClick = () => {
    onExportSettings(generateSettingsJson());
  };

  const renderCards = (
    cards: typeof statistics | typeof charts,
    title: string,
    type: "stats" | "charts"
  ) => {
    const visibleCards = cards.filter((card) =>
      type === "stats"
        ? visibleStats.includes(card.id)
        : visibleCharts.includes(card.id)
    );

    if (visibleCards.length === 0) return null;

    const grids = type === "stats" ? statsGrids : chartsGrids;

    return (
      <>
        <Typography style={{ marginTop: 20 }}>{title}:</Typography>
        <Row gutter={[16, 16]}>
          {visibleCards.map((card) => {
            const isSelected =
              selectedCard?.id === card.id && selectedCard.type === type;
            const isEditable = !selectionType || selectionType === type;
            const gridValue =
              grids[card.id] ||
              (type === "stats" ? defaultStatsGrid : defaultChartsGrid);

            return (
              <Col
                key={card.id}
                span={gridValue}
                style={{
                  border: isSelected ? "2px solid #1890ff" : "none",
                  padding: "8px",
                  borderRadius: "4px",
                  opacity: isEditable ? 1 : 0.6,
                  transition: "all 0.3s",
                }}
              >
                <div
                  onClick={() => isEditable && handleCardClick(card.id, type)}
                  style={{ cursor: isEditable ? "pointer" : "default" }}
                >
                  {card.component}
                </div>
                {isSelected && (
                  <div style={{ marginTop: 8 }}>
                    <CustomGridSelect
                      currentValue={gridValue}
                      onChange={handleLayoutChange}
                      selectedCardId={card.id}
                    />
                  </div>
                )}
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  return (
    <Card>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Admin Panel Preview —<strong> Stats Grid:</strong> {defaultStatsGrid} |
        <strong> Charts Grid:</strong> {defaultChartsGrid}
        {selectionType && (
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            (Editing: {selectionType})
          </Typography.Text>
        )}
      </Typography.Title>

      <Button
        onClick={handleExportClick}
        style={{ marginBottom: 16 }}
        type="primary"
      >
        Export Current Settings
      </Button>

      {renderCards(statistics, "Statistics", "stats")}
      {renderCards(charts, "Charts", "charts")}
    </Card>
  );
};

export default Main;
