from django.contrib import admin
from .models import Product, Category, Review

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display  = ['name', 'brand', 'price', 'stock', 'supplier', 'is_active']
    list_filter   = ['is_active', 'brand']
    search_fields = ['name', 'part_number', 'vehicle_model']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'buyer', 'rating']