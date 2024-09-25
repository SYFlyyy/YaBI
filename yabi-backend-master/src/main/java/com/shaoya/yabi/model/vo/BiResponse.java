package com.shaoya.yabi.model.vo;

import lombok.Data;

/**
 * BI 的返回结果
 *
 * @author shaoyafan
 */
@Data
public class BiResponse {

    /**
     * 生成的图表数据
     */
    private String genChart;

    /**
     * 生成的分析结论
     */
    private String genResult;

    /**
     * 生成的图表 id
     */
    private Long chartId;
}
