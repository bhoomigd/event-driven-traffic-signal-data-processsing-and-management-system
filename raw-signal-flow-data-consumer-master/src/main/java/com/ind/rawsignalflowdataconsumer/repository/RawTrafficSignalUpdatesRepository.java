package com.ind.rawsignalflowdataconsumer.repository;

import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawTrafficSignalUpdatesRepository extends JpaRepository<RawTrafficSignalUpdates, Long> {
}
