package com.ind.rawsignalflowdataconsumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(
        scanBasePackages = {
                "com.ind.trafficsignaldomain",
                "com.ind.rawsignalflowdataconsumer"// your shared domain
        }
)
@EntityScan(basePackages = {
        "com.ind.trafficsignaldomain.entity"    // add domain entities
})
public class RawSignalFlowDataConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RawSignalFlowDataConsumerApplication.class, args);
    }

}
