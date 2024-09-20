package com.shaoya.yabi.manager;

/*import com.shaoya.yabi.common.ErrorCode;
import com.shaoya.yabi.exception.BusinessException;
import com.yupi.yucongming.dev.client.YuCongMingClient;
import com.yupi.yucongming.dev.common.BaseResponse;
import com.yupi.yucongming.dev.model.DevChatRequest;
import com.yupi.yucongming.dev.model.DevChatResponse;*/
import io.github.briqt.spark4j.SparkClient;
import io.github.briqt.spark4j.constant.SparkApiVersion;
import io.github.briqt.spark4j.model.SparkMessage;
import io.github.briqt.spark4j.model.SparkSyncChatResponse;
import io.github.briqt.spark4j.model.request.SparkRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.annotation.Resource;
import java.util.ArrayList;

/**
 * 对接 AI 服务
 */
@Component
@Slf4j
public class AiManager {
    /*@Resource
    private YuCongMingClient yuCongMingClient;*/

    @Resource
    private SparkClient sparkClient;

    public static final String PRECONDITION = "你是一个数据分析师和前端开发专家，接下来我会按照以下固定格式给你提供内容\n" +
            "分析需求：\n" +
            "我的数据分析需求\n" +
            "原始数据：\n" +
            "我的 csv 格式原始数据，用 , 作为分隔符\n" +
            "\n" +
            "根据这两部分内容，按照以下格式生成代码和结论（你只需要生成代码和结论，此外不要输出任何多余的开头、结尾、注释）\n" +
            "【【【【【\n" +
            "（这里你需要输出前端 Echarts V5 的 option 配置对象 JSON 代码）\n" +
            "【【【【【\n" +
            "（这里你需要根据原始数据输出分析得出的结论）\n" +
            "最终格式：【【【【【 JSON 代码【【【【【 数据分析结论\n" +
            "\n" +
            "输出示例：\n" +
            "【【【【【\n" +
            "{\n" +
            "    \"title\": {\n" +
            "        \"text\": \"网站用户增长情况\"\n" +
            "    },\n" +
            "    \"tooltip\": {}\n" +
            "    \"legend\": {\n" +
            "        \"data\": [\"用户数\"]\n" +
            "    },\n" +
            "    \"xAxis\": {\n" +
            "        \"type\": \"category\",\n" +
            "        \"data\": [\"1号\", \"2号\", \"3号\"]\n" +
            "    },\n" +
            "    \"yAxis\": {\n" +
            "        \"type\": \"value\"\n" +
            "    },\n" +
            "    \"series\": [{\n" +
            "        \"name\": \"用户数\",\n" +
            "        \"type\": \"line\",\n" +
            "        \"data\": [10, 20, 30]\n" +
            "    }]\n" +
            "}\n" +
            "【【【【【\n" +
            "根据提供的原始数据，我们可以看到在前三天内，网站的用户数量呈现逐日递增的趋势。具体来说，1号有10个用户访问了网站，2号增加到了20个用户，3号更是达到了30个用户。这表明网站的用户流量在逐渐增长。\n";

    /**
     * 向 AI 发送请求
     *
     * @param content
     * @return
     */
    public String sendMesToAiBySpark(String content) {
        ArrayList<SparkMessage> messages = new ArrayList<>();
        messages.add(SparkMessage.userContent(content));
        // 构造请求
        SparkRequest sparkRequest = SparkRequest.builder()
                // 消息列表
                .messages(messages)
                // tokens 最大长度
                .maxTokens(2048)
                // 灵活的
                .topK(4)
                // 核采样阈值
                .temperature(0.5)
                // 指定请求版本
                .apiVersion(SparkApiVersion.V1_5)
                .build();
        // 同步调用
        SparkSyncChatResponse chatResponse = sparkClient.chatSync(sparkRequest);
        String responseContent = chatResponse.getContent();
        log.info("AI 响应: {}", responseContent);
        return responseContent;
    }

    /**
     * AI 对话
     *
     * @param message
     * @return
     */
    /*public String doChat(long modelId, String message) {
        DevChatRequest devChatRequest = new DevChatRequest();
        devChatRequest.setModelId(modelId);
        devChatRequest.setMessage(message);
        BaseResponse<DevChatResponse> response = yuCongMingClient.doChat(devChatRequest);
        if (response == null) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "AI 响应错误");
        }
        return response.getData().getContent();
    }*/
}
