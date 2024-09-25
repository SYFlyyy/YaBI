package com.shaoya.yabi.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.shaoya.yabi.model.entity.Chart;

/**
* @author shaoyafan
* @description 针对表【chart(图表信息表)】的数据库操作Service
* @createDate 2024-09-15 17:25:56
*/
public interface ChartService extends IService<Chart> {
    void handleChartUpdateError(Long chartId, String execMessage);

    String buildUserInput(Chart chart);
}
