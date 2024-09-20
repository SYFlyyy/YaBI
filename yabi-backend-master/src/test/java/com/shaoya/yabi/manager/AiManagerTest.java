package com.shaoya.yabi.manager;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
class AiManagerTest {
    @Resource
    private AiManager aiManager;

    /*@Test
    void doChat() {
        String result = aiManager.doChat(1836411817918394369L, "林俊杰");
        System.out.println(result);
    }*/
}