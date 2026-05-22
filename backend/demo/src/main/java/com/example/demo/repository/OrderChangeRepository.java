package com.example.demo.repository;

import com.example.demo.model.OrderChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderChangeRepository extends JpaRepository<OrderChange, Long> {
    List<OrderChange> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    List<OrderChange> findByOrderNumberOrderByCreatedAtDesc(String orderNumber);
    void deleteByOrderId(Long orderId);
}
