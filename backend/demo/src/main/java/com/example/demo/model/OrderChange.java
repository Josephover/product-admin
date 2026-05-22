package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_changes")
public class OrderChange {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_id", nullable = false)
    private Long orderId;
    
    @Column(name = "order_number", nullable = false)
    private String orderNumber;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ChangeType changeType;
    
    @Column(name = "change_description", length = 1000)
    private String changeDescription;
    
    @Column(name = "changed_by")
    private String changedBy = "SYSTEM";
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt = System.currentTimeMillis();
    
    public enum ChangeType {
        CREATED("Orden Creada"),
        UPDATED("Orden Actualizada"),
        STATUS_CHANGED("Estado Cambiado"),
        DELETED("Orden Eliminada");
        
        private final String displayName;
        
        ChangeType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructores
    public OrderChange() {}
    
    public OrderChange(Long orderId, String orderNumber, ChangeType changeType, String changeDescription) {
        this.orderId = orderId;
        this.orderNumber = orderNumber;
        this.changeType = changeType;
        this.changeDescription = changeDescription;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getOrderId() {
        return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public String getOrderNumber() {
        return orderNumber;
    }
    
    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }
    
    public ChangeType getChangeType() {
        return changeType;
    }
    
    public void setChangeType(ChangeType changeType) {
        this.changeType = changeType;
    }
    
    public String getChangeDescription() {
        return changeDescription;
    }
    
    public void setChangeDescription(String changeDescription) {
        this.changeDescription = changeDescription;
    }
    
    public String getChangedBy() {
        return changedBy;
    }
    
    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }
    
    public Long getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
}
