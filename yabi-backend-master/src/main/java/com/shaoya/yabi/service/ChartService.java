package com.shaoya.yabi.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.shaoya.yabi.model.entity.Chart;

/**
 * 图表服务
 *
* @author shaoyafan
*/
public interface ChartService extends IService<Chart> {
    void handleChartUpdateError(Long chartId, String execMessage);

    String buildUserInput(Chart chart);
}
