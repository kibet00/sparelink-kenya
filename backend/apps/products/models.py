"""
SpareLink Kenya - Products Model
"""

from django.db import models
from apps.users.models import User


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    supplier      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category      = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')

    # Product details
    name          = models.CharField(max_length=255)
    description   = models.TextField(blank=True)
    part_number   = models.CharField(max_length=100, blank=True)
    brand         = models.CharField(max_length=100, blank=True)
    vehicle_model = models.CharField(max_length=200)

    # Pricing & stock
    price         = models.DecimalField(max_digits=10, decimal_places=2)
    stock         = models.PositiveIntegerField(default=0)

    # Image
    image         = models.ImageField(upload_to='products/', blank=True, null=True)

    # Timestamps
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)
    is_active     = models.BooleanField(default=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.brand} ({self.vehicle_model})"

    @property
    def in_stock(self):
        return self.stock > 0

    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)


class Review(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    buyer      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating     = models.PositiveSmallIntegerField()
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        unique_together = ('product', 'buyer')

    def __str__(self):
        return f"{self.buyer.full_name} → {self.product.name} ({self.rating}★)"