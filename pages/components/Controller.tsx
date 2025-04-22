import { Card, Col, Row, Select, Typography } from "antd";
import React from "react";
import { grid, statistics } from "../data/data";

const Controller = ({ setShowColumn, setShowCard }) => {
  const options = statistics.map((data) => {
    return { value: data.id, label: data.name, component: data.component };
  });

  const gridCustom = grid.map((data) => {
    return { value: data.value, label: data.title };
  });

  // Select card for visible to user
  const onChange = (value: string) => {
    setShowCard(value);
  };

  // Grid customization
  const onChangeColumn = (value: string) => {
    setShowColumn(value);
  };
  return (
    <div>
      <Card>
        <Typography>Hello I am controller</Typography>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Select
              mode="tags"
              placeholder="Select components"
              optionFilterProp="label"
              onChange={onChange}
              options={options}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={24}>
            <Select
              placeholder="Select column size"
              optionFilterProp="label"
              onChange={onChangeColumn}
              options={gridCustom}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Controller;
