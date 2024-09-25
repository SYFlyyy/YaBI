import {Button, Card, Form, message, Select, Space, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import {genChartByAiAsyncMqUsingPost, genChartByAiAsyncUsingPost} from "@/services/yabi/chartController";
import React, {useState} from "react";
import {useForm} from "antd/es/form/Form";

/**
 * 添加图表（异步）
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
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
      // const res = await genChartByAiAsyncUsingPost(params, {}, value.file.file.originFileObj);
      const res = await genChartByAiAsyncMqUsingPost(params, {}, value.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后在我的图表页面查看');
        // 清空表单
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          form={form}
          name="addChart"
          lableAlign="left"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
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
                {value: '折线图', label: '折线图'},
                {value: '柱状图', label: '柱状图'},
                {value: '堆叠图', label: '堆叠图'},
                {value: '饼图', label: '饼图'},
                {value: '雷达图', label: '雷达图'},
              ]}
            />
          </Form.Item>

          {/*文件上传*/}
          <Form.Item
            name="file"
            label="原始数据"
          >
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined/>}>上传 CSV 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{span: 16, offset: 4}}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                提交
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
