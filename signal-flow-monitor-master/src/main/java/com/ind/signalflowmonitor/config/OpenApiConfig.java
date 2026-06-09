package com.ind.signalflowmonitor.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Traffic Signal Monitor API")
                        .version("1.0")
                        .description("API for Traffic Signal Monitoring"));
    }
}
