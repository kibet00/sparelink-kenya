"""
SpareLink Kenya - Orders Model
"""

from django.db import models
from apps.users.models import User
from apps.products.models import Product


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING   = 'pending',   'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        PAID      = 'paid',      'Paid'
        SHIPPED   = 'shipped',   'Shipped'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    buyer         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status        = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    shipping_info = models.TextField(blank=True)
    total_amount  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} by {self.buyer.full_name} [{self.status}]"

    def calculate_total(self):
        self.total_amount = sum(item.subtotal for item in self.items.all())
        self.save()


class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product  = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price    = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    @property
    def subtotal(self):
        return self.price * self.quantity