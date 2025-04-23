// import { Col } from "antd";
// import React from "react";

// interface Card {
//   id: number;
//   grid: number;
//   component: React.ReactNode;
// }

// interface StatisticsProps {
//   filterCard?: Card[]; // Make it optional
//   handleClick: (id: number) => void;
// }

// const Statistics: React.FC<StatisticsProps> = ({
//   filterCard = [],
//   handleClick,
// }) => {
//   return (
//     <>
//       {filterCard.map((card) => (
//         <Col
//           key={card.id}
//           span={card.grid}
//           onClick={() => handleClick(card.id)}
//         >
//           {card.component}
//         </Col>
//       ))}
//     </>
//   );
// };

// export default Statistics;
