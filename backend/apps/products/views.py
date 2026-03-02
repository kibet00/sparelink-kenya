from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Review
from .serializers import (
    ProductSerializer, ProductCreateUpdateSerializer,
    CategorySerializer, ReviewSerializer
)
from apps.users.permissions import IsSupplier, IsAdminUser


class ProductListView(generics.ListAPIView):
    """Public: Browse and search all active products"""
    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ['category', 'brand', 'supplier']
    search_fields      = ['name', 'part_number', 'brand', 'vehicle_model', 'description']
    ordering_fields    = ['price', 'created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, supplier__status='active')
        vehicle = self.request.query_params.get('vehicle')
        if vehicle:
            queryset = queryset.filter(vehicle_model__icontains=vehicle)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Public: View a single product with reviews"""
    serializer_class   = ProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset           = Product.objects.filter(is_active=True)


class SupplierProductListView(generics.ListAPIView):
    """Supplier: View own product listings"""
    serializer_class   = ProductSerializer
    permission_classes = [IsSupplier]

    def get_queryset(self):
        return Product.objects.filter(supplier=self.request.user)


class SupplierProductCreateView(generics.CreateAPIView):
    """Supplier: Add a new product"""
    serializer_class   = ProductCreateUpdateSerializer
    permission_classes = [IsSupplier]

    def perform_create(self, serializer):
        serializer.save(supplier=self.request.user)


class SupplierProductUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Supplier: Edit or delete own product"""
    serializer_class   = ProductCreateUpdateSerializer
    permission_classes = [IsSupplier]

    def get_queryset(self):
        return Product.objects.filter(supplier=self.request.user)

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        product.is_active = False
        product.save()
        return Response({'message': 'Product removed from listings.'})


class ReviewCreateView(generics.CreateAPIView):
    """Buyer: Leave a review for a product"""
    serializer_class   = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product = Product.objects.get(pk=self.kwargs['product_id'])
        serializer.save(buyer=self.request.user, product=product)


class CategoryListView(generics.ListAPIView):
    """Public: List all product categories"""
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset           = Category.objects.all()