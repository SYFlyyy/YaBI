import {Button, Form, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {genChartByAiUsingPost} from "@/services/yabi/chartController";
import React, {useState} from "react";
import ReactECharts from 'echarts-for-react';

const AddChart: React.FC = () => {
  // const option = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['1号', '2号', '3号']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [{
  //     data: [10, 20, 30],
  //     type: 'line'
  //   }]
  // };
  // 定义状态，接收后端的返回值
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  // 提交中的状态
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onFinish = async (value: any) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
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
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
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
          name="chartType"
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
        {/* 如果它存在，才渲染这个组件 */}
        {
          // 后端返回的代码是字符串，不是对象，用JSON.parse解析成对象
          option && <ReactECharts option={option}/>
        }
      </div>
    </div>
  );
};
export default AddChart;
