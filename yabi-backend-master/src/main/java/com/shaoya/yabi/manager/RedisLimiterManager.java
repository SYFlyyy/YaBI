package com.shaoya.yabi.manager;

import org.redisson.api.RRateLimiter;
import org.redisson.api.RateIntervalUnit;
import org.redisson.api.RateType;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Redis限流管理器
 *
 * @author shaoyafan
 */
@Service
public class RedisLimiterManager {
    @Resource
    private RedissonClient redissonClient;

    /**
     * 限流操作
     *
     * @param key
     */
    public void doRateLimit(String key) {
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(key);
        // 限流器统计规则（每秒 2 个请求；连续的请求，最多只能有 1 个请求被允许通过）
        rateLimiter.trySetRate(RateType.OVERALL, 2, 1, RateIntervalUnit.SECONDS);
        // 每当一个操作来了，请求一个令牌
        boolean canOp = rateLimiter.tryAcquire(1);
        if (!canOp) {
            throw new RuntimeException("请求过于频繁，请稍后再试");
        }
    }
}
