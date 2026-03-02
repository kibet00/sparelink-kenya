from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Payment
from apps.orders.models import Order


class InitiatePaymentView(APIView):
    """Buyer: Record a payment attempt for an order"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(pk=order_id, buyer=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=404)

        if hasattr(order, 'payment') and order.payment.status == Payment.Status.SUCCESS:
            return Response({'error': 'Order already paid.'}, status=400)

        phone      = request.data.get('phone')
        mpesa_code = request.data.get('mpesa_code', '')

        payment, _ = Payment.objects.get_or_create(order=order, defaults={
            'amount': order.total_amount,
            'phone':  phone,
        })

        if mpesa_code:
            payment.mpesa_code = mpesa_code
            payment.status     = Payment.Status.SUCCESS
            payment.paid_at    = timezone.now()
            payment.save()

            order.status = Order.Status.PAID
            order.save()

            return Response({'message': 'Payment confirmed. Order is now processing.'})

        return Response({'message': 'Payment initiated. Awaiting M-Pesa confirmation.'})