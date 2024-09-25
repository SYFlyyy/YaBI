package com.shaoya.yabi.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.shaoya.yabi.common.ChartStatus;
import com.shaoya.yabi.manager.AiManager;
import com.shaoya.yabi.mapper.ChartMapper;
import com.shaoya.yabi.model.entity.Chart;
import com.shaoya.yabi.service.ChartService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
 * 图表服务实现
 *
* @author shaoyafan
*/
@Service
public class ChartServiceImpl extends ServiceImpl<ChartMapper, Chart>
    implements ChartService {

    @Override
    public void handleChartUpdateError(Long chartId, String execMessage) {
        Chart updateChart = new Chart();
        updateChart.setId(chartId);
        updateChart.setStatus(ChartStatus.Failed);
        updateChart.setExecMessage(execMessage);
        boolean updateResult = this.updateById(updateChart);
        if (!updateResult) {
            log.error("更新图表状态失败" + chartId + "," + execMessage);
        }
    }

    @Override
    public String buildUserInput(Chart chart) {
        String goal = chart.getGoal();
        String chartType = chart.getChartType();
        String csvData = chart.getChartData();

        StringBuilder userInput = new StringBuilder();
        userInput.append(AiManager.PRECONDITION);
        userInput.append("分析需求：").append("\n");
        String userGoal = goal;
        // 如果图表类型不为空
        if(StringUtils.isNotBlank(chartType)) {
            // 分析目标拼接上图表类型
            userGoal += "，请使用：" + chartType;
        }
        userInput.append(userGoal).append("\n");
        userInput.append("原始数据：").append("\n");
        // 将数据转换为 csv 格式
        userInput.append(csvData).append("\n");
        return userInput.toString();
    }
}




