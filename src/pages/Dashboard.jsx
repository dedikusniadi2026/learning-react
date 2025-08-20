import React, { useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Statistic,
  Progress,
  Space,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TagOutlined,
} from "@ant-design/icons";
import Chart from "react-apexcharts";
import { Timeline } from "antd";
import MonthlyEarningCard from '../components/MonthlyEarningCard';
import { Anchor } from 'antd';


const { Title, Text } = Typography;

const Dashboard = () => {
  const [emailChart] = useState({
    series: [
      { name: "Series A", data: [45, 55, 40, 65, 30, 50, 40, 55, 35, 25, 35, 45] },
      { name: "Series B", data: [15, 20, 22, 10, 15, 20, 25, 28, 18, 15, 22, 25] },
      { name: "Series C", data: [10, 20, 15, 15, 12, 10, 15, 18, 12, 10, 20, 18] },
    ],
    options: {
      chart: { type: "bar", stacked: true, toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "40%", borderRadius: 5 },
      },
      xaxis: {
        categories: [
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ],
      },
      legend: { position: "top" },
      fill: { opacity: 1 },
      colors: ["#556ee6", "#f1b44c", "#34c38f"],
    },
  });

  return (
    <Layout style={{ background: "#ffffff", minHeight: "100vh", padding: 20 }}>

      <Row style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Title level={3}>DASHBOARD</Title>
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        <Col xs={24} md={12} lg={7}>
          <Card
            style={{
              background: "linear-gradient(135deg, #7474bf 0%, #348ac7 100%)",
              color: "#fff",
              borderRadius: 12,
            }}
          >
            <Row gutter={16}>
              <Col flex="80px">
                <Avatar size={64} src="https://i.pravatar.cc/150?img=32" />
              </Col>
              <Col flex="auto">
                <Title level={5} style={{ color: "#fff", marginBottom: 0 }}>
                  Henry Price
                </Title>
                <Text style={{ color: "#f0f0f0" }}>UI/UX Designer</Text>
                <div style={{ marginTop: 10 }}>
                  <Button type="primary" style={{ background: "#556ee6" }}>
                    View Profile
                  </Button>
                </div>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={12}>
                <Statistic title="Projects" value={125} valueStyle={{ color: "#fff" }} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Revenue"
                  prefix="$"
                  value={1245}
                  valueStyle={{ color: "#fff" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={5}>
          <Card>
            <Space direction="vertical">
              <ShoppingCartOutlined
                style={{ fontSize: 28, color: "#556ee6" }}
              />
              <Statistic title="Orders" value={1235} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={5}>
          <Card>
            <Space direction="vertical">
              <DollarOutlined style={{ fontSize: 28, color: "#34c38f" }} />
              <Statistic title="Revenue" prefix="$" value={35723} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={5}>
          <Card>
            <Space direction="vertical">
              <TagOutlined style={{ fontSize: 28, color: "#f1b44c" }} />
              <Statistic title="Average Price" value={16.2} prefix="$" />
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>        
        <MonthlyEarningCard/>
          
        <Col xs={24} lg={16}>
          <Card
            title="Email Sent"
            extra={
              <Space>
                <Button size="small">Week</Button>
                <Button size="small">Month</Button>
                <Button size="small" type="primary">
                  Year
                </Button>
              </Space>
            }
          >
            <Chart
              options={emailChart.options}
              series={emailChart.series}
              type="bar"
              height={280}
            />
          </Card>
        </Col>
      </Row>
  <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
  <Col xs={24} lg={8}>
    <Card title="Social Source">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={64}
            style={{ backgroundColor: "#f0f2ff", color: "#3b5998" }}
            icon={<UserOutlined />}
          />
          <Title level={5} style={{ marginTop: 10 }}>
            Facebook - 125 sales
          </Title>
          <Text type="secondary">
            Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus tincidunt.
          </Text>
          <br />
          <Anchor href="#">Learn more →</Anchor>
        </div>

        <Row justify="space-around" style={{ marginTop: 20 }}>
          <Col style={{ textAlign: "center" }}>
            <Avatar style={{ background: "#3b5998" }} icon={<UserOutlined />} />
            <div>Facebook</div>
            <Text type="secondary">125 sales</Text>
          </Col>
          <Col style={{ textAlign: "center" }}>
            <Avatar style={{ background: "#1DA1F2" }} icon={<UserOutlined />} />
            <div>Twitter</div>
            <Text type="secondary">112 sales</Text>
          </Col>
          <Col style={{ textAlign: "center" }}>
            <Avatar style={{ background: "#E1306C" }} icon={<UserOutlined />} />
            <div>Instagram</div>
            <Text type="secondary">104 sales</Text>
          </Col>
        </Row>
      </Space>
    </Card>
  </Col>

      <Col xs={24} lg={8}>
        <Card title="Activity">
          <Timeline mode="left">
            <Timeline.Item label="22 Nov" color="green">
              Responded to need “Volunteer Activities”
            </Timeline.Item>
            <Timeline.Item label="17 Nov" color="blue">
              Everyone realizes why a new common language would be desirable...{" "}
              <Anchor href="#">Read More</Anchor>
            </Timeline.Item>
            <Timeline.Item label="15 Nov" color="purple">
              Joined the group “Boardsmanship Forum”
            </Timeline.Item>
            <Timeline.Item label="22 Nov" color="green">
              Responded to need “In-Kind Opportunity”
            </Timeline.Item>
          </Timeline>
          <Button type="primary" block style={{ marginTop: 10 }}>
            View More →
          </Button>
        </Card>
      </Col>

        <Col xs={24} lg={8}>
          <Card title="Top Cities Selling Product" style={{ textAlign: "center" }}>
            <Title level={2}>1,456</Title>
            <Text>San Francisco</Text>
            <div style={{ marginTop: 20 }}>
              <Row justify="space-between">
                <Text>San Francisco</Text>
                <Text strong>1,456</Text>
              </Row>
              <Progress percent={100} showInfo={false} strokeColor="#556ee6" />
              <Row justify="space-between">
                <Text>Los Angeles</Text>
                <Text strong>1,123</Text>
              </Row>
              <Progress percent={75} showInfo={false} strokeColor="#34c38f" />
              <Row justify="space-between">
                <Text>San Diego</Text>
                <Text strong>1,026</Text>
              </Row>
              <Progress percent={65} showInfo={false} strokeColor="#f1b44c" />
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
