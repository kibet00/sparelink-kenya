from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order
from .serializers import OrderSerializer
from apps.users.permissions import IsAdminUser


class PlaceOrderView(generics.CreateAPIView):
    """Buyer: Place a new order"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class BuyerOrderListView(generics.ListAPIView):
    """Buyer: View own order history"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """Buyer or Supplier: View a specific order"""
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        if user.role == 'supplier':
            return Order.objects.filter(items__product__supplier=user).distinct()
        return Order.objects.filter(buyer=user)


class UpdateOrderStatusView(APIView):
    """Supplier or Admin: Update order status"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)

        new_status = request.data.get('status')
        valid = [s[0] for s in Order.Status.choices]
        if new_status not in valid:
            return Response({'error': f'Invalid status. Choose from: {valid}'}, status=400)

        order.status = new_status
        order.save()
        return Response({'message': f'Order #{order.id} updated to {new_status}.'})