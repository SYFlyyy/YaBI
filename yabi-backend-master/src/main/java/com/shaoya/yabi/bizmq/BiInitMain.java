package com.shaoya.yabi.bizmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;


/**
 * 创建测试程序用到的交换机和队列
 */
public class BiInitMain {
    public static void main(String[] args) {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            // factory.setHost("localhost");
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();
            String exchangeName = BiMqConstant.BI_EXCHANGE_NAME;
            channel.exchangeDeclare(exchangeName, "direct");
            String queueName = BiMqConstant.BI_QUEUE_NAME;
            channel.queueDeclare(queueName, true, false, false, null);
            channel.queueBind(queueName, exchangeName, BiMqConstant.BI_ROUTING_KEY);
        } catch (Exception e) {

        }
    }
}
