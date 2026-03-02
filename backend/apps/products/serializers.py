from rest_framework import serializers
from .models import Product, Category, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug']


class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)

    class Meta:
        model  = Review
        fields = ['id', 'buyer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'buyer_name', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    supplier_name     = serializers.CharField(source='supplier.full_name', read_only=True)
    supplier_location = serializers.CharField(source='supplier.business_location', read_only=True)
    category_name     = serializers.CharField(source='category.name', read_only=True)
    average_rating    = serializers.SerializerMethodField()
    review_count      = serializers.SerializerMethodField()
    in_stock          = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Product
        fields = [
            'id', 'name', 'description', 'part_number', 'brand',
            'vehicle_model', 'price', 'stock', 'in_stock', 'image',
            'category', 'category_name',
            'supplier', 'supplier_name', 'supplier_location',
            'average_rating', 'review_count',
            'created_at', 'updated_at', 'is_active',
        ]
        read_only_fields = ['id', 'supplier', 'created_at', 'updated_at', 'is_active']

    def get_average_rating(self, obj):
        return obj.average_rating()

    def get_review_count(self, obj):
        return obj.reviews.count()


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Used by suppliers to create/update their products"""
    class Meta:
        model  = Product
        fields = [
            'name', 'description', 'part_number', 'brand',
            'vehicle_model', 'price', 'stock', 'image', 'category',
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero.')
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError('Stock cannot be negative.')
        return value