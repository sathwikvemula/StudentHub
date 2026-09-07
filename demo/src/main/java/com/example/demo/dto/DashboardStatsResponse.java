// DashboardStatsResponse.java
package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private Map<String, Long> categoryCounts;
    private long completed;
    private long pending;
}