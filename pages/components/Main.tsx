import React, { useEffect, useState } from "react";
import { Card, Col, Row, Select, Typography } from "antd";
import { grid, statistics } from "@/pages/data/data";
import CustomGridSelect from "./CustomGridSelect";
import Statistics from "./Statistics";

const Main = ({ showColumn, showCard }) => {
  const [filterCard, setFilterCard] = useState([]);
  const [cardColumnMap, setCardColumnMap] = useState({});
  const [selectedCardId, setSelectedCardId] = useState(null);

  // useEffect(() => {
  //   if (!showCard || showCard.length === 0) {
  //     setFilterCard(statistics);
  //   } else {
  //     const selectedCards = statistics.filter((card) =>
  //       showCard.includes(card.id)
  //     );
  //     setFilterCard(selectedCards);
  //   }
  // }, [showCard, statistics]);

  useEffect(() => {
    const selectedCards =
      !showCard || showCard.length === 0
        ? statistics
        : statistics.filter((card) => showCard.includes(card.id));

    const updatedCards = selectedCards.map((card) => ({
      ...card,
      grid: cardColumnMap[card.id] || showColumn,
    }));

    setFilterCard(updatedCards);
  }, [showCard, showColumn, cardColumnMap]);

  const handleClick = (id) => {
    setSelectedCardId(id);
  };

  const handleColumnChange = (value) => {
    if (selectedCardId) {
      setCardColumnMap((prev) => ({
        ...prev,
        [selectedCardId]: parseInt(value),
      }));
    }
  };

  useEffect(() => {
    if (showColumn) {
      setCardColumnMap({});
      setSelectedCardId(null);
    }
  }, [showColumn]);

  return (
    <div>
      <Card>
        <Typography>
          Hello I am main content . <strong>Column: </strong>
          {showColumn}
        </Typography>
        {selectedCardId && (
          <CustomGridSelect
            selectedCardId={selectedCardId}
            currentValue={cardColumnMap[selectedCardId] || showColumn}
            onChange={handleColumnChange}
          />
        )}
        <div>
          <Typography>Statistics:</Typography>
          <Row gutter={[16, 16]}>
            <Statistics filterCard={filterCard} handleClick={handleClick} />
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default Main;
