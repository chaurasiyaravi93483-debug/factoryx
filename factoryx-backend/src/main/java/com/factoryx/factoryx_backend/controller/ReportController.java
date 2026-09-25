package com.factoryx.factoryx_backend.controller;

import com.factoryx.factoryx_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;


    // =====================================================
    // NORMAL REPORTS
    // =====================================================

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports() {

        return ResponseEntity.ok(
                reportService.getReports()
        );
    }


    // =====================================================
    // AI REPORT
    // =====================================================

    @PostMapping("/ai-generate")
    public ResponseEntity<Map<String, Object>> generateAIReport() {

        try {

            String report =
                    reportService.generateAIReport();


            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "success",
                    true
            );

            response.put(
                    "title",
                    "FactoryX AI Factory Report"
            );

            response.put(
                    "report",
                    report
            );


            return ResponseEntity.ok(
                    response
            );


        } catch (Exception e) {

            e.printStackTrace();


            Map<String, Object> response =
                    new LinkedHashMap<>();


            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Failed to generate AI report."
            );


            return ResponseEntity
                    .internalServerError()
                    .body(response);
        }
    }
}