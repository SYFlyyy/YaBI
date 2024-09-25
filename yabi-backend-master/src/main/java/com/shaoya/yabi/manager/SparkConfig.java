package com.shaoya.yabi.manager;

import io.github.briqt.spark4j.SparkClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 讯飞星火配置
 *
 * @author shaoyafan
 */
@Configuration
@ConfigurationProperties(prefix = "xunfei.client")
@Data
public class SparkConfig {

    private String appId;

    private String apiKey;

    private String apiSecret;

    @Bean
    public SparkClient sparkClient() {
        SparkClient sparkClient = new SparkClient();
        sparkClient.appid = appId;
        sparkClient.apiKey = apiKey;
        sparkClient.apiSecret = apiSecret;
        return sparkClient;
    }
}
