package com.example.demo.repository;

import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Buscar orden por número de orden
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Obtener todas las órdenes de un cliente
    List<Order> findByCustomerName(String customerName);
    
    // Obtener todas las órdenes por estado
    List<Order> findByStatus(OrderStatus status);
    
    // Buscar órdenes por email del cliente
    List<Order> findByCustomerEmail(String customerEmail);
    
    // Obtener todas las órdenes ordenadas por fecha de creación descendente
    List<Order> findAllByOrderByCreatedAtDesc();
}
