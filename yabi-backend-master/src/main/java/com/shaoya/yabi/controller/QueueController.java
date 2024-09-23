package com.shaoya.yabi.controller;

import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.shaoya.yabi.annotation.AuthCheck;
import com.shaoya.yabi.common.BaseResponse;
import com.shaoya.yabi.common.DeleteRequest;
import com.shaoya.yabi.common.ErrorCode;
import com.shaoya.yabi.common.ResultUtils;
import com.shaoya.yabi.constant.CommonConstant;
import com.shaoya.yabi.constant.UserConstant;
import com.shaoya.yabi.exception.BusinessException;
import com.shaoya.yabi.exception.ThrowUtils;
import com.shaoya.yabi.manager.AiManager;
import com.shaoya.yabi.manager.RedisLimiterManager;
import com.shaoya.yabi.model.dto.chart.*;
import com.shaoya.yabi.model.entity.Chart;
import com.shaoya.yabi.model.entity.User;
import com.shaoya.yabi.model.vo.BiResponse;
import com.shaoya.yabi.service.ChartService;
import com.shaoya.yabi.service.UserService;
import com.shaoya.yabi.utils.ExcelUtils;
import com.shaoya.yabi.utils.SqlUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 队列测试
 *
 * @author shaoyafan
 */
@RestController
@RequestMapping("/queue")
@Slf4j
@Profile({"dev", "local"})
public class QueueController {
    @Resource
    private ThreadPoolExecutor threadPoolExecutor;

    @GetMapping("/add")
    public void add(String name) {
        CompletableFuture.runAsync(() -> {
            log.info("任务执行中：" + name + "，执行人：" + Thread.currentThread().getName());
            try {
                Thread.sleep(600000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, threadPoolExecutor);
    }

    @GetMapping("/get")
    public String get() {
        Map<String, Object> map = new HashMap<>();
        int size = threadPoolExecutor.getQueue().size();
        map.put("队列长度", size);
        long taskCount = threadPoolExecutor.getTaskCount();
        map.put("任务总数", taskCount);
        long completedTaskCount = threadPoolExecutor.getCompletedTaskCount();
        map.put("已完成任务数", completedTaskCount);
        int activeCount = threadPoolExecutor.getActiveCount();
        map.put("活跃线程数", activeCount);
        return JSONUtil.toJsonStr(map);
    }
}
