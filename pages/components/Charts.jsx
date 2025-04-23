import { Col } from "antd";
import React from "react";

import BarChartLib from "./BarChartLib";
import ComposeChart from "./ComposeChart";
import PieChartLib from "./PieChartLib";

const Charts = () => {
  return (
    <>
      <Col span={8}>
        <BarChartLib />
      </Col>

      <Col span={8}>
        <ComposeChart />
      </Col>

      <Col span={8}>
        <PieChartLib />
      </Col>
    </>
  );
};

export default Charts;
