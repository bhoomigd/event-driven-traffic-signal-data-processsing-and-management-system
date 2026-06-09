package com.ind.rawsignalflowdataconsumer.service;

import com.ind.rawsignalflowdataconsumer.repository.RawTrafficSignalUpdatesRepository;
import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import org.springframework.stereotype.Service;

@Service
public class TrafficSignalUpdateService {

    private final RawTrafficSignalUpdatesRepository rawTrafficSignalUpdatesRepository;

    public TrafficSignalUpdateService(RawTrafficSignalUpdatesRepository rawTrafficSignalUpdatesRepository) {
        this.rawTrafficSignalUpdatesRepository = rawTrafficSignalUpdatesRepository;
    }

    public void saveRawTrafficSignalUpdates(RawTrafficSignalUpdates rawTrafficSignalUpdates) {
        rawTrafficSignalUpdatesRepository.save(rawTrafficSignalUpdates);
    }
}
