package com.shaoya.yabi.bizmq;

import com.rabbitmq.client.Channel;
import com.shaoya.yabi.common.ChartStatus;
import com.shaoya.yabi.common.ErrorCode;
import com.shaoya.yabi.exception.BusinessException;
import com.shaoya.yabi.manager.AiManager;
import com.shaoya.yabi.model.entity.Chart;
import com.shaoya.yabi.service.ChartService;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
@Slf4j
public class BiMessageConsumer {
    @Resource
    private ChartService chartService;

    @Resource
    private AiManager aiManager;

    @SneakyThrows
    @RabbitListener(queues = {BiMqConstant.BI_QUEUE_NAME}, ackMode = "MANUAL")
    public void receiveMessage(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long deliverTag) {
        if (StringUtils.isBlank(message)) {
            // 如果更新失败，拒绝当前消息，让消息重新进入队列
            channel.basicNack(deliverTag, false, false);
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "消息为空");
        }
        long chartId = Long.parseLong(message);
        Chart chart = chartService.getById(chartId);
        if (chart == null) {
            channel.basicNack(deliverTag, false, false);
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "图表为空");
        }
        // 修改图表状态为“执行中”
        Chart updateChart = new Chart();
        updateChart.setId(chart.getId());
        updateChart.setStatus(ChartStatus.RUNNING);
        boolean b = chartService.updateById(updateChart);
        if (!b) {
            channel.basicNack(deliverTag, false, false);
            chartService.handleChartUpdateError(chart.getId(), "更新图表执行中状态失败");
            return;
        }

        String result = aiManager.sendMesToAiBySpark(chartService.buildUserInput(chart));
        // 对结果进行拆分
        String[] split = result.split("【【【【【");
        if (split.length < 3) {
            channel.basicNack(deliverTag, false, false);
            chartService.handleChartUpdateError(chart.getId(), "AI 生成错误");
            return;
        }
        String genChart = split[1].trim();
        String genResult = split[2].trim();

        Chart updateChartResult = new Chart();
        updateChartResult.setId(chart.getId());
        updateChartResult.setGenChart(genChart);
        updateChartResult.setGenResult(genResult);
        updateChartResult.setStatus(ChartStatus.SUCCEED);
        boolean updateResult = chartService.updateById(updateChartResult);
        if (!updateResult) {
            // 如果更新图表状态失败，拒绝消息并处理图表更新错误
            channel.basicNack(deliverTag, false, false);
            chartService.handleChartUpdateError(chart.getId(), "更新图表成功状态失败");
        }
        // 确认消息
        channel.basicAck(deliverTag, false);
    }
}
