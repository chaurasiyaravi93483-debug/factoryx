package com.factoryx.factoryx_backend.service;

import com.factoryx.factoryx_backend.entity.Incident;
import com.factoryx.factoryx_backend.entity.Inventory;
import com.factoryx.factoryx_backend.entity.Machine;
import com.factoryx.factoryx_backend.entity.Maintenance;
import com.factoryx.factoryx_backend.entity.Production;
import com.factoryx.factoryx_backend.entity.Quality;

import com.factoryx.factoryx_backend.repository.IncidentRepository;
import com.factoryx.factoryx_backend.repository.InventoryRepository;
import com.factoryx.factoryx_backend.repository.MachineRepository;
import com.factoryx.factoryx_backend.repository.MaintenanceRepository;
import com.factoryx.factoryx_backend.repository.ProductionRepository;
import com.factoryx.factoryx_backend.repository.QualityRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MachineRepository machineRepository;
    private final ProductionRepository productionRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final InventoryRepository inventoryRepository;
    private final QualityRepository qualityRepository;
    private final IncidentRepository incidentRepository;

    private final AIService aiService;


    // =====================================================
    // NORMAL REPORTS
    // =====================================================

    public Map<String, Object> getReports() {

        long machineCount =
                machineRepository.count();

        long productionCount =
                productionRepository.count();

        long maintenanceCount =
                maintenanceRepository.count();

        long inventoryCount =
                inventoryRepository.count();

        long qualityCount =
                qualityRepository.count();

        long incidentCount =
                incidentRepository.count();


        List<Map<String, Object>> reports =
                new ArrayList<>();


        reports.add(
                createReport(
                        "RPT-1001",
                        "Daily Production Report",
                        "Production"
                )
        );


        reports.add(
                createReport(
                        "RPT-1002",
                        "Machine Performance Report",
                        "Machines"
                )
        );


        reports.add(
                createReport(
                        "RPT-1003",
                        "Maintenance Activity Report",
                        "Maintenance"
                )
        );


        reports.add(
                createReport(
                        "RPT-1004",
                        "Quality Inspection Report",
                        "Quality"
                )
        );


        reports.add(
                createReport(
                        "RPT-1005",
                        "Incident Analysis Report",
                        "Incidents"
                )
        );


        reports.add(
                createReport(
                        "RPT-1006",
                        "Inventory Status Report",
                        "Inventory"
                )
        );


        Map<String, Object> stats =
                new LinkedHashMap<>();


        stats.put(
                "totalReports",
                reports.size()
        );

        stats.put(
                "production",
                productionCount
        );

        stats.put(
                "quality",
                qualityCount
        );

        stats.put(
                "aiReports",
                0
        );


        Map<String, Object> data =
                new LinkedHashMap<>();


        data.put(
                "stats",
                stats
        );

        data.put(
                "reports",
                reports
        );


        Map<String, Object> sourceCounts =
                new LinkedHashMap<>();


        sourceCounts.put(
                "machines",
                machineCount
        );

        sourceCounts.put(
                "production",
                productionCount
        );

        sourceCounts.put(
                "maintenance",
                maintenanceCount
        );

        sourceCounts.put(
                "inventory",
                inventoryCount
        );

        sourceCounts.put(
                "quality",
                qualityCount
        );

        sourceCounts.put(
                "incidents",
                incidentCount
        );


        data.put(
                "sourceCounts",
                sourceCounts
        );


        return data;
    }


    // =====================================================
    // AI FACTORY REPORT
    // =====================================================

    public String generateAIReport() {

        List<Machine> machines =
                machineRepository.findAll();

        List<Production> productions =
                productionRepository.findAll();

        List<Maintenance> maintenances =
                maintenanceRepository.findAll();

        List<Inventory> inventoryItems =
                inventoryRepository.findAll();

        List<Quality> qualityRecords =
                qualityRepository.findAll();

        List<Incident> incidents =
                incidentRepository.findAll();


        StringBuilder factoryData =
                new StringBuilder();


        // =================================================
        // MACHINES
        // =================================================

        factoryData.append(
                "\nMACHINES\n"
        );

        factoryData.append(
                "Total Machines: "
        ).append(
                machines.size()
        ).append("\n");


        for (Machine machine : machines) {

            factoryData.append(
                    "- Code: "
            ).append(
                    machine.getMachineCode()
            ).append(
                    ", Name: "
            ).append(
                    machine.getMachineName()
            ).append(
                    ", Type: "
            ).append(
                    machine.getType()
            ).append(
                    ", Location: "
            ).append(
                    machine.getLocation()
            ).append(
                    ", Status: "
            ).append(
                    machine.getStatus()
            ).append(
                    ", Efficiency: "
            ).append(
                    machine.getEfficiency()
            ).append(
                    ", Temperature: "
            ).append(
                    machine.getTemperature()
            ).append(
                    ", Vibration: "
            ).append(
                    machine.getVibration()
            ).append("\n");
        }


        // =================================================
        // PRODUCTION
        // =================================================

        factoryData.append(
                "\nPRODUCTION\n"
        );

        factoryData.append(
                "Total Production Records: "
        ).append(
                productions.size()
        ).append("\n");


        for (Production production : productions) {

            factoryData.append(
                    "- Machine: "
            ).append(
                    production.getMachine()
            ).append(
                    ", Date: "
            ).append(
                    production.getDate()
            ).append(
                    ", Shift: "
            ).append(
                    production.getShift()
            ).append(
                    ", Target: "
            ).append(
                    production.getTargetQuantity()
            ).append(
                    ", Actual: "
            ).append(
                    production.getActualQuantity()
            ).append(
                    ", Defects: "
            ).append(
                    production.getDefectiveQuantity()
            ).append(
                    ", Downtime: "
            ).append(
                    production.getDowntime()
            ).append("\n");
        }


        // =================================================
        // MAINTENANCE
        // =================================================

        factoryData.append(
                "\nMAINTENANCE\n"
        );

        factoryData.append(
                "Total Maintenance Records: "
        ).append(
                maintenances.size()
        ).append("\n");


        for (Maintenance maintenance : maintenances) {

            factoryData.append(
                    "- ID: "
            ).append(
                    maintenance.getMaintenanceId()
            ).append(
                    ", Machine: "
            ).append(
                    maintenance.getMachine()
            ).append(
                    ", Issue: "
            ).append(
                    maintenance.getIssue()
            ).append(
                    ", Type: "
            ).append(
                    maintenance.getType()
            ).append(
                    ", Priority: "
            ).append(
                    maintenance.getPriority()
            ).append(
                    ", Status: "
            ).append(
                    maintenance.getStatus()
            ).append(
                    ", Assigned To: "
            ).append(
                    maintenance.getAssignedTo()
            ).append("\n");
        }


        // =================================================
        // INVENTORY
        // =================================================

        factoryData.append(
                "\nINVENTORY\n"
        );

        factoryData.append(
                "Total Inventory Items: "
        ).append(
                inventoryItems.size()
        ).append("\n");


        for (Inventory item : inventoryItems) {

            factoryData.append(
                    "- Code: "
            ).append(
                    item.getItemCode()
            ).append(
                    ", Name: "
            ).append(
                    item.getItemName()
            ).append(
                    ", Category: "
            ).append(
                    item.getCategory()
            ).append(
                    ", Quantity: "
            ).append(
                    item.getQuantity()
            ).append(
                    ", Minimum Stock: "
            ).append(
                    item.getMinimumStock()
            ).append(
                    ", Unit: "
            ).append(
                    item.getUnit()
            ).append(
                    ", Status: "
            ).append(
                    item.getStatus()
            ).append("\n");
        }


        // =================================================
        // QUALITY
        // =================================================

        factoryData.append(
                "\nQUALITY\n"
        );

        factoryData.append(
                "Total Quality Records: "
        ).append(
                qualityRecords.size()
        ).append("\n");


        for (Quality quality : qualityRecords) {

            factoryData.append(
                    "- ID: "
            ).append(
                    quality.getQualityId()
            ).append(
                    ", Product: "
            ).append(
                    quality.getProduct()
            ).append(
                    ", Machine: "
            ).append(
                    quality.getMachine()
            ).append(
                    ", Team: "
            ).append(
                    quality.getTeam()
            ).append(
                    ", Quality Score: "
            ).append(
                    quality.getQualityScore()
            ).append(
                    ", Defects: "
            ).append(
                    quality.getDefects()
            ).append(
                    ", Status: "
            ).append(
                    quality.getStatus()
            ).append("\n");
        }


        // =================================================
        // INCIDENTS
        // =================================================

        factoryData.append(
                "\nINCIDENTS\n"
        );

        factoryData.append(
                "Total Incidents: "
        ).append(
                incidents.size()
        ).append("\n");


        for (Incident incident : incidents) {

            factoryData.append(
                    "- ID: "
            ).append(
                    incident.getIncidentId()
            ).append(
                    ", Title: "
            ).append(
                    incident.getTitle()
            ).append(
                    ", Machine: "
            ).append(
                    incident.getMachine()
            ).append(
                    ", Location: "
            ).append(
                    incident.getLocation()
            ).append(
                    ", Status: "
            ).append(
                    incident.getStatus()
            ).append("\n");
        }


        // =================================================
        // SEND DATA TO GROQ
        // =================================================

        return aiService.generateFactoryReport(
                factoryData.toString()
        );
    }


    // =====================================================
    // CREATE REPORT
    // =====================================================

    private Map<String, Object> createReport(
            String id,
            String title,
            String category
    ) {

        Map<String, Object> report =
                new LinkedHashMap<>();


        report.put(
                "id",
                id
        );

        report.put(
                "title",
                title
        );

        report.put(
                "category",
                category
        );

        report.put(
                "period",
                LocalDate.now()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy"
                                )
                        )
        );

        report.put(
                "generated",
                "Today"
        );

        report.put(
                "status",
                "Ready"
        );


        return report;
    }
}