from django.db import models
from apps.orders.models import Order


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED  = 'failed',  'Failed'

    order      = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    mpesa_code = models.CharField(max_length=20, blank=True)
    amount     = models.DecimalField(max_digits=10, decimal_places=2)
    phone      = models.CharField(max_length=15)
    status     = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    paid_at    = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'

    def __str__(self):
        return f"Payment for Order #{self.order.id} [{self.status}]"