package com.techie.idea.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(KafkaConfiguration.class);

    @Bean
    public NewTopic trafficUpdatesTopic() {
        logger.info("Creating Kafka Topic: traffic_signal_updates_raw");
        return TopicBuilder.name("traffic_signal_updates_raw").partitions(3).replicas(1).build();
    }
}
