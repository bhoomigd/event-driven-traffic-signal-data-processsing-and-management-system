package com.ind.signalflowmonitor.repository;

import com.ind.trafficsignaldomain.entity.RawTrafficSignalUpdates;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RawTrafficSignalUpdatesRepository extends JpaRepository<RawTrafficSignalUpdates, Long> {

    // Optionally: Custom query to get latest for ALL signals
    @Query(value = "SELECT r.* FROM raw_traffic_signal_updates r " +
            "INNER JOIN (SELECT signal_id, MAX(timestamp) as maxts " +
            "            FROM raw_traffic_signal_updates GROUP BY signal_id) t " +
            "    ON r.signal_id = t.signal_id AND r.timestamp = t.maxts", nativeQuery = true)
    List<RawTrafficSignalUpdates> findLatestPerSignal();
}
