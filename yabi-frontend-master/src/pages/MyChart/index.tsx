import React, {useEffect, useState} from "react";
import {listMyChartVoByPageUsingPost} from "@/services/yabi/chartController";
import {Avatar, Card, List, message, Result} from "antd";
import ReactECharts from "echarts-for-react";
import {useModel} from "@@/exports";
import Search from "antd/es/input/Search";

/**
 * 我的图表
 * @constructor
 */
const MyChartPage: React.FC = () => {
  // 将初始条件分离出来，便于后面恢复初始条件
  const initSearchParams = {
    // 默认第一页
    current: 1,
    // 默认每页 4 条数据
    pageSize: 4,
    // 默认按创建时间排序
    sortField: 'createTime',
    // 默认倒叙
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  // 定义变量存储图表数据
  const [chartList, setChartList] = useState<API.Chart[]>([]);
  // 数据总数，默认 0
  const [total, setTotal] = useState<number>(0);
  const {initialState} = useModel('@@initialState');
  const {currentUser} = initialState ?? {};
  const [loading, setLoading] = useState<boolean>(false);

  // 获取数据的异步函数
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartVoByPageUsingPost(searchParams);
      if (res.data) {
        // 成功则将数据回显到前端；为空则设置为空数组
        setChartList(res.data.records ?? []);
        // 数据总数为空则为 0
        setTotal(res.data.total ?? 0);
        // 统一去除标题
        if (res.data.records) {
          res.data.records.forEach(data => {
            // 图表状态为 succeed 时，才解析图表代码
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              // 把标题设为 undefined
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          })
        }
      } else {
        message.error("获取图表失败");
      }
    } catch (e: any) {
      message.error("获取图表失败：" + e.message);
    }
    setLoading(false)
  }

  // 初始化加载数据
  useEffect(() => {
    // 页面首次渲染时执行 loadData 方法
    loadData();
  }, [searchParams]);

  return (
    <div className="my-chart-page">
      {/*搜索框*/}
      <div>
        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={value => {
          setSearchParams({
            ...searchParams, name: value
          });
        }}/>
      </div>
      <div className={"margin-16"}/>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            // 切换页码时，更新查询条件
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{width: '100%'}}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar}/>}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />

              <>
                {
                  item.status === 'wait' && <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMessage ?? '当前图表生成队列繁忙，请耐心等候'}
                    />
                  </>
                }
                {
                  item.status === 'running' && <>
                    <Result
                      status="info"
                      title="图表生成中"
                      subTitle={item.execMessage}
                    />
                  </>
                }
                {
                  item.status === 'succeed' && <>
                    <div className={"margin-16"}/>
                    <p>{'分析目标：' + item.goal}</p>
                    <div className={"margin-16"}/>
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)}/>
                  </>
                }
                {
                  item.status === 'failed' && <>
                    <Result
                      status="error"
                      title="图表生成失败"
                      subTitle={item.execMessage}
                    />
                  </>
                }
              </>
            </Card>
          </List.Item>
        )}
      />

    </div>
  );
};
export default MyChartPage;
