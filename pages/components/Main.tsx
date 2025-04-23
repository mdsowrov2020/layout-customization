import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { statistics, charts } from "@/pages/data/data";
import CustomGridSelect from "./CustomGridSelect";

interface MainProps {
  activeSettings: {
    stats: {
      visibleComponents: string[];
      defaultGrid: number;
    };
    charts: {
      visibleComponents: string[];
      defaultGrid: number;
    };
  };
  selectionType: string | null;
  currentScreen: string;
}

const Main = ({ activeSettings, selectionType, currentScreen }: MainProps) => {
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

  const renderCards = (
    cards: typeof statistics | typeof charts,
    title: string,
    type: "stats" | "charts"
  ) => {
    const { visibleComponents, defaultGrid } = activeSettings[type];
    const grids = type === "stats" ? statsGrids : chartsGrids;

    const visibleCards = cards.filter((card) =>
      visibleComponents.includes(card.id)
    );
    if (visibleCards.length === 0) return null;

    return (
      <>
        <Typography style={{ marginTop: 20 }}>{title}:</Typography>
        <Row gutter={[16, 16]}>
          {visibleCards.map((card) => {
            const isSelected =
              selectedCard?.id === card.id && selectedCard.type === type;
            const isEditable = !selectionType || selectionType === type;
            const gridValue = grids[card.id] || defaultGrid;

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
        Admin Panel Preview — Current Screen: {currentScreen}
        {selectionType && (
          <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
            (Editing: {selectionType})
          </Typography.Text>
        )}
      </Typography.Title>

      {renderCards(statistics, "Statistics", "stats")}
      {renderCards(charts, "Charts", "charts")}
    </Card>
  );
};

export default Main;
