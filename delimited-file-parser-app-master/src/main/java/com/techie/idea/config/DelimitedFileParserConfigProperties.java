package com.techie.idea.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;


@ConfigurationProperties(prefix = "techie.generic")
@Data
public class DelimitedFileParserConfigProperties {

    private Path inputPath;
    private Path archivePath;
    private String filenamePattern;
    private String[] fileHeaders;
    private int chunkSize;
    private String fileDelimiter;
    private String outboundTopic;
    private String messageType;
    private String messageKey;
    private String messageSrc;

}