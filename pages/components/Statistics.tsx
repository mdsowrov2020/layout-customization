import { Col } from "antd";
import React from "react";

const Statistics = ({ filterCard, handleClick }) => {
  return (
    <>
      {filterCard.map((card) => (
        <Col
          // span={cardColumnMap[card.id] || showColumn}
          span={card.grid}
          onClick={() => handleClick(card.id)}
        >
          {card.component}
        </Col>
      ))}
    </>
  );
};

export default Statistics;
