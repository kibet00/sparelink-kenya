from rest_framework import serializers, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Message
from apps.users.models import User


class MessageSerializer(serializers.ModelSerializer):
    sender_name   = serializers.CharField(source='sender.full_name', read_only=True)
    receiver_name = serializers.CharField(source='receiver.full_name', read_only=True)

    class Meta:
        model  = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name',
                  'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class SendMessageView(generics.CreateAPIView):
    """Send a message to another registered user"""
    serializer_class   = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class ConversationView(APIView):
    """Get full message thread between current user and another user"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            other = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        messages = Message.objects.filter(
            Q(sender=request.user, receiver=other) |
            Q(sender=other, receiver=request.user)
        )
        messages.filter(receiver=request.user, is_read=False).update(is_read=True)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


class InboxView(APIView):
    """List all users the current user has had conversations with"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        sent     = Message.objects.filter(sender=user).values_list('receiver', flat=True)
        received = Message.objects.filter(receiver=user).values_list('sender', flat=True)
        partner_ids = set(list(sent) + list(received))
        partners = User.objects.filter(id__in=partner_ids).values('id', 'full_name', 'role')
        return Response(list(partners))