package com.shaoya.yabi.bizmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

/**
 * 创建测试程序用到的交换机和队列
 *
 * @author shaoyafan
 */
public class MqInitMain {
    public static void main(String[] args) {
        try {
            ConnectionFactory factory = new ConnectionFactory();
            // factory.setHost("localhost");
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();
            String exchangeName = "code_exchange";
            channel.exchangeDeclare(exchangeName, "direct");
            String queueName = "code_queue";
            channel.queueDeclare(queueName, true, false, false, null);
            channel.queueBind(queueName, exchangeName, "my_routingKey");
        } catch (Exception e) {

        }
    }
}
