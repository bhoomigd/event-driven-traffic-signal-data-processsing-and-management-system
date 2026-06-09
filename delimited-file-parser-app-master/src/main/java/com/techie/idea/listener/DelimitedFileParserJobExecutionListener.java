package com.techie.idea.listener;

import com.techie.idea.config.DelimitedFileParserConfigProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOCase;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Objects;

import static com.techie.idea.util.AppConstants.INPUT_FILE_HEADERS;
import static com.techie.idea.util.AppConstants.INPUT_FILE_NAME;

@Component
@Slf4j
@RequiredArgsConstructor
public class DelimitedFileParserJobExecutionListener implements JobExecutionListener {

    private final DelimitedFileParserConfigProperties delimitedFileParserConfigProperties;
    @Override
    public void beforeJob(JobExecution jobExecution) {
        log.info("Before job execution");
        //region can be like ASIAPACIFIC,AMERICAS,EUR,etc...This is set in
        final String region = jobExecution.getJobParameters().getString("region");
//        String region = "EUR";
        File directory = delimitedFileParserConfigProperties.getInputPath().resolve(Objects.requireNonNull(region)).toFile();
        if(!directory.isDirectory()){
            throw new IllegalArgumentException(directory + "is no directory.");
        }

        FilenameFilter patternFilter = new WildcardFileFilter(String.format(delimitedFileParserConfigProperties.getFilenamePattern(),region), IOCase.INSENSITIVE);
        File[] fileList = directory.listFiles(patternFilter);
        if(ArrayUtils.isEmpty(fileList)){
            log.error("no .dat input file found");
            throw new RuntimeException(String.format("no .dat input file found"));
        } else if (fileList.length == 1) {
            log.info(">>> .DAT input file found ");
            jobExecution.getExecutionContext().put(INPUT_FILE_NAME,fileList[0].getAbsolutePath());
            String[] fileHeaders = delimitedFileParserConfigProperties.getFileHeaders();
            jobExecution.getExecutionContext().put(INPUT_FILE_HEADERS,fileHeaders);

        }


    }

    @Override
    public void afterJob(JobExecution jobExecution) {

    }
}
