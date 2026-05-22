package com.example.demo.service;

import com.example.demo.model.Order;
import com.example.demo.model.OrderChange;
import com.example.demo.repository.OrderChangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderChangeService {
    
    @Autowired
    private OrderChangeRepository orderChangeRepository;
    
    public void logOrderCreated(Order order) {
        OrderChange change = new OrderChange(
            order.getId(),
            order.getOrderNumber(),
            OrderChange.ChangeType.CREATED,
            "Orden creada con monto $" + order.getTotalAmount()
        );
        orderChangeRepository.save(change);
    }
    
    public void logOrderUpdated(Order order, String details) {
        OrderChange change = new OrderChange(
            order.getId(),
            order.getOrderNumber(),
            OrderChange.ChangeType.UPDATED,
            details
        );
        orderChangeRepository.save(change);
    }
    
    public void logStatusChanged(Order order, String oldStatus, String newStatus) {
        OrderChange change = new OrderChange(
            order.getId(),
            order.getOrderNumber(),
            OrderChange.ChangeType.STATUS_CHANGED,
            "Estado cambió de " + oldStatus + " a " + newStatus
        );
        orderChangeRepository.save(change);
    }
    
    public void logOrderDeleted(Long orderId, String orderNumber) {
        OrderChange change = new OrderChange(
            orderId,
            orderNumber,
            OrderChange.ChangeType.DELETED,
            "Orden eliminada"
        );
        orderChangeRepository.save(change);
    }
    
    public List<OrderChange> getOrderChanges(Long orderId) {
        return orderChangeRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
    }
    
    public List<OrderChange> getOrderChangesByNumber(String orderNumber) {
        return orderChangeRepository.findByOrderNumberOrderByCreatedAtDesc(orderNumber);
    }
    
    public void deleteOrderChanges(Long orderId) {
        orderChangeRepository.deleteByOrderId(orderId);
    }
}
