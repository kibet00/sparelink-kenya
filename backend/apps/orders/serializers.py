from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal     = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model  = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['id', 'price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items      = OrderItemSerializer(many=True)
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)

    class Meta:
        model  = Order
        fields = ['id', 'buyer', 'buyer_name', 'status', 'shipping_info',
                  'total_amount', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'buyer', 'status', 'total_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            product  = item_data['product']
            quantity = item_data['quantity']

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Insufficient stock for {product.name}. Available: {product.stock}"
                )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )
            # Deduct stock
            product.stock -= quantity
            product.save()

        order.calculate_total()
        return order