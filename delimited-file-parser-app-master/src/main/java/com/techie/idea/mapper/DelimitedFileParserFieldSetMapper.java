package com.techie.idea.mapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.transform.FieldSet;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class DelimitedFileParserFieldSetMapper extends BeanWrapperFieldSetMapper<JSONObject> {
    private final String[] inputFileHeaders;

    public JSONObject mapFieldSet(FieldSet fieldSet) {
        JSONObject record = new JSONObject();
        for (int i = 0; i < fieldSet.getFieldCount(); i++) {
            record.put(inputFileHeaders[i], StringUtils.isEmpty(fieldSet.readString(i)) ? null : fieldSet.readString(i));
        }
        return record;
    }
}
