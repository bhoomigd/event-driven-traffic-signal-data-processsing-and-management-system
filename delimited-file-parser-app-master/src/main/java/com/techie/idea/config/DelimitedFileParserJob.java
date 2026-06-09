package com.techie.idea.config;

import com.techie.idea.listener.DelimitedFileParserJobExecutionListener;
import com.techie.idea.mapper.DelimitedFileParserFieldSetMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.transform.DefaultFieldSetFactory;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.batch.item.file.transform.FieldSetFactory;
import org.springframework.batch.item.file.transform.IncorrectTokenCountException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.FileSystemResource;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.Arrays;
import java.util.Objects;

import static com.techie.idea.util.AppConstants.READ_AND_PUBLISH_DELIMITED_FILE_PARSER_JOB;
import static com.techie.idea.util.AppConstants.READ_AND_PUBLISH_DELIMITED_FILE_PARSER_STEP;

@Configuration
@EnableBatchProcessing
@EnableAutoConfiguration
@Slf4j
@RequiredArgsConstructor
public class DelimitedFileParserJob {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;

    private final DelimitedFileParserJobExecutionListener delimitedFileParserJobExecutionListener;

    private final DelimitedFileParserConfigProperties delimitedFileParserConfigProperties;

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${send.to.kafka.topic}")
    private boolean sendToKafkaTopic;

    @Value("${techie.generic.outbound-topic}")
    private String outboundTopic;
    @Bean
    public Job readAndPublishDelimitedFileParserJob() {
        return jobBuilderFactory.get(READ_AND_PUBLISH_DELIMITED_FILE_PARSER_JOB)
                .incrementer(new RunIdIncrementer())
                .listener(delimitedFileParserJobExecutionListener)
                .start(readAndPublishDelimitedFileParserStep(null, null))
                .build();
    }

    @Bean
    @JobScope
    public Step readAndPublishDelimitedFileParserStep(@Value("#{jobParameters['region']}") String region, @Value("#{jobExecutionContext['inputFileName']}") String inputFileName) {
        return stepBuilderFactory.get(READ_AND_PUBLISH_DELIMITED_FILE_PARSER_STEP)
                .<JSONObject, JSONObject>chunk(delimitedFileParserConfigProperties.getChunkSize())
                .reader(delimitedFileReader(null, null))
                .writer(records -> {

                    for (JSONObject record : records) {
                        String messageKey = String.valueOf(record.get(delimitedFileParserConfigProperties.getMessageKey()));
                        String messageValue = record.toString(); // ✅ Convert JSONObject to String
                        if(!sendToKafkaTopic){
                            log.info("Message key : {} ,logged successfully !!!", messageKey);
                        }else{
                            kafkaTemplate.send(outboundTopic, messageKey, messageValue);
                            log.info("Message key : {} ,written to kafka topic successfully !!!", messageKey);
                        }
                    }

                })
                .build();
    }


    @JobScope
    @Bean
    public FlatFileItemReader<JSONObject> delimitedFileReader(@Value("#{jobExecutionContext['inputFileName']}") String inputFileName, @Value("#{jobExecutionContext['inputFileHeaders']}") String[] inputFileHeaders) {
        DelimitedFileParserFieldSetMapper delimitedFileParserFieldSetMapper = new DelimitedFileParserFieldSetMapper(inputFileHeaders);
        FieldSetFactory fieldSetFactory = new DefaultFieldSetFactory();
        DelimitedLineTokenizer delimitedLineTokenizer = new DelimitedLineTokenizer();
        delimitedLineTokenizer.setDelimiter(delimitedFileParserConfigProperties.getFileDelimiter());
        delimitedLineTokenizer.setNames(delimitedFileParserConfigProperties.getFileHeaders());

        return new FlatFileItemReaderBuilder<JSONObject>()
                .name("delimitedFileReader")
                .resource(new FileSystemResource(delimitedFileParserConfigProperties.getInputPath().resolve(inputFileName)))
                .linesToSkip(1)
                .lineTokenizer(s -> {
                    try {
                        return delimitedLineTokenizer.tokenize(s);
                    } catch (IncorrectTokenCountException e) {
                        log.warn("Attempting lenient parsing of failed input line");
                        final String[] tokens = StringUtils.splitPreserveAllTokens(s, delimitedFileParserConfigProperties.getFileDelimiter());
                        final String[] objects = Arrays.stream(Objects.requireNonNull(tokens)).map(token -> StringUtils.unwrap(token, '"')).toArray(String[]::new);
                        return fieldSetFactory.create(objects, delimitedFileParserConfigProperties.getFileHeaders());
                    }
                })
                .fieldSetMapper(delimitedFileParserFieldSetMapper)
                .build();

    }
}
