package com.ind.signalflowmonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication(
		scanBasePackages = {
				"com.ind.trafficsignaldomain" ,     // your shared domain
				"com.ind.signalflowmonitor"
		}
)
@EntityScan(basePackages = {
		"com.ind.trafficsignaldomain.entity"    // add domain entities
})
public class SignalFlowMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(SignalFlowMonitorApplication.class, args);
	}

}
