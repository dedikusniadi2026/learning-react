import React from "react";
import Chart from "react-apexcharts";
import { ArrowUpRight } from "lucide-react";
import { Card, Typography, Tag, Row, Col, Button, Divider, Space } from "antd";

const { Text, Paragraph, Title } = Typography;

const MonthlyEarningCard = () => {
  const chartOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { margin: 0, size: "70%" },
        track: {
          background: "#f1f5f9",
          strokeWidth: "100%",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: { lineCap: "round" },
    colors: ["#4f46e5"],
  };

  const chartSeries = [67];

  return (
    <Card
      style={{ width: 360 }}
      bodyStyle={{ padding: 20 }}
      bordered={false}
    >
      {/* Header */}
      <Row justify="space-between" align="middle">
        <Text strong style={{ fontSize: 18, color: "#374151" }}>
          Monthly Earning
        </Text>
        <Tag color="blue">Report</Tag>
      </Row>

      {/* Content */}
      <Row justify="space-between" align="middle" style={{ marginTop: 20 }}>
        <Col>
          <Text type="secondary">This month</Text>
          <Title level={3} style={{ margin: "4px 0" }}>
            $34,252
          </Title>
          <Space size={4} align="center">
            <Text type="success" strong>
              <ArrowUpRight size={16} /> 12%
            </Text>
            <Text type="secondary">from previous period</Text>
          </Space>
        </Col>

        <Col>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="radialBar"
            height={120}
          />
          <Text strong style={{ display: "block", textAlign: "center" }}>
            67% Target
          </Text>
        </Col>
      </Row>

      {/* Footer */}
      <Divider />
      <Button type="primary">View More</Button>
      <Paragraph type="secondary" style={{ marginTop: 12 }}>
        We craft digital, graphic and dimensional thinking to create
        category-leading brand experiences.
      </Paragraph>
    </Card>
  );
};

export default MonthlyEarningCard;
