import React, { useState } from "react";
import { Card, Col, Row, Typography } from "antd";
import { statistics, charts } from "@/lib/data/data";
import CustomGridSelect from "./CustomGridSelect";
import { GridSettings } from "../../lib/model/type";

interface MainProps {
  activeSettings?: {
    stats: GridSettings;
    charts: GridSettings;
  };
  selectionType?: "stats" | "charts" | null;
  currentScreen?: string;
  onGridChange?: (type: "stats" | "charts", id: number, value: number) => void;
}

const defaultSettings = {
  stats: {
    visibleComponents: [] as number[],
    defaultGrid: 4,
    customGrids: {} as Record<number, number>,
  },
  charts: {
    visibleComponents: [] as number[],
    defaultGrid: 12,
    customGrids: {} as Record<number, number>,
  },
};

const Main: React.FC<MainProps> = ({
  activeSettings = defaultSettings,
  selectionType = null,
  currentScreen = "desktop",
  onGridChange = () => {},
}) => {
  const [selectedCard, setSelectedCard] = useState<{
    id: number;
    type: "stats" | "charts";
  } | null>(null);

  const handleCardClick = (id: number, type: "stats" | "charts") => {
    if (!selectionType || selectionType === type) {
      setSelectedCard((prev) =>
        prev?.id === id && prev.type === type ? null : { id, type }
      );
    }
  };

  const handleLayoutChange = (value: number) => {
    if (!selectedCard) return;
    onGridChange(selectedCard.type, selectedCard.id, value);
    setSelectedCard(null);
  };

  const renderCards = (
    cards: typeof statistics | typeof charts,
    title: string,
    type: "stats" | "charts"
  ) => {
    const {
      visibleComponents = [],
      defaultGrid = type === "stats" ? 4 : 12,
      customGrids = {},
    } = activeSettings[type] || {};

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
            const gridValue = customGrids[card.id] || defaultGrid;

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
                      selectedCardId={card.id.toString()}
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
