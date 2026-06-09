package com.techie.idea;

import com.techie.idea.config.DelimitedFileParserConfigProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties({DelimitedFileParserConfigProperties.class})
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class DelimitedFileParserAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(DelimitedFileParserAppApplication.class, args);
	}

}
