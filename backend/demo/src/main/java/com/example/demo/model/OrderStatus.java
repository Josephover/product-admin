package com.example.demo.model;

public enum OrderStatus {
    PENDING("Pendiente"),
    CONFIRMED("Confirmado"),
    SHIPPED("Enviado"),
    DELIVERED("Entregado"),
    CANCELLED("Cancelado"),
    RETURNED("Devuelto");
    
    private final String displayName;
    
    OrderStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
