package com.shaoya.yabi.common;

import java.io.Serializable;
import lombok.Data;

/**
 * 删除请求
 *
 * @author shaoyafan
 */
@Data
public class DeleteRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    private static final long serialVersionUID = 1L;
}