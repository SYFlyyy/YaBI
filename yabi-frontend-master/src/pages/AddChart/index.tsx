import {Button, Form, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {genChartByAiUsingPost} from "@/services/yabi/chartController";
import React, {useState} from "react";
import ReactECharts from 'echarts-for-react';

const AddChart: React.FC = () => {
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
  // 定义状态，接收后端的返回值
  const [chart, setChart] = useState<API.BiResponse>();

  const onFinish = async (value: any) => {
    const params = {
      ...value,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPost(params, {}, value.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
  };

  return (
    <div className="add-chart">
      <Form
        name="addChart"
        onFinish={onFinish}
        initialValues={{}}
      >
        {/*分析目标*/}
        <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标！'}]}>
          <TextArea placeholder="请输入你的分析需求，比如：分析网站用户的增长情况"/>
        </Form.Item>

        {/*图表名称*/}
        <Form.Item name="name" label="图表名称">
          <TextArea placeholder="请输入图表名称"/>
        </Form.Item>

        {/*图表类型*/}
        <Form.Item
          name="selectChartType"
          label="图表类型"
        >
          <Select
            options={[
              { value: '折线图', label: '折线图' },
              { value: '柱状图', label: '柱状图' },
              { value: '堆叠图', label: '堆叠图' },
              { value: '饼图', label: '饼图' },
              { value: '雷达图', label: '雷达图' },
            ]}
          />
        </Form.Item>

        {/*文件上传*/}
        <Form.Item
          name="file"
          label="原始数据"
        >
          <Upload name="file">
            <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <div>
        分析结论：{chart?.genResult}
      </div>
      <div>
        生成图表：
        <ReactECharts option={options} />
      </div>
    </div>
  );
};
export default AddChart;
