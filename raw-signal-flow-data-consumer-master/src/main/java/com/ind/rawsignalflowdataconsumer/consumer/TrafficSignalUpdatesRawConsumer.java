package com.ind.rawsignalflowdataconsumer.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ind.rawsignalflowdataconsumer.service.TrafficSignalUpdateService;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class TrafficSignalUpdatesRawConsumer {

    private static final Logger LOGGER = Logger.getLogger(TrafficSignalUpdatesRawConsumer.class.getName());

    private final TrafficSignalUpdateService trafficSignalUpdateService;

    private final ObjectMapper objectMapper;

    public TrafficSignalUpdatesRawConsumer(TrafficSignalUpdateService trafficSignalUpdateService, ObjectMapper objectMapper) {
        this.trafficSignalUpdateService = trafficSignalUpdateService;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "traffic_signal_updates_raw", groupId = "raw_signal_flow_data_consumer_group")
    public void consumeRawTrafficSignalUpdates(String message) {
        LOGGER.info("📥 Received Traffic Signal Updates from Kafka: " + message);
        try {
            // Parse JSON to TrafficData object
            RawTrafficSignalUpdates rawTrafficSignalUpdates = objectMapper.readValue(message, RawTrafficSignalUpdates.class);
            trafficSignalUpdateService.saveRawTrafficSignalUpdates(rawTrafficSignalUpdates);

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "❌ Error processing Kafka message: " + message, e);
        }
    }
}
