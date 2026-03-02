"""
SpareLink Kenya - User Serializers
"""

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirm Password')

    class Meta:
        model  = User
        fields = [
            'email', 'full_name', 'phone', 'role',
            'business_name', 'business_location',
            'password', 'password2',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        role = validated_data.get('role', User.Role.BUYER)

        # Suppliers start as pending until admin verifies them
        if role == User.Role.SUPPLIER:
            validated_data['status'] = User.Status.PENDING_VERIFICATION
            validated_data['is_active'] = True

        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if user.status == User.Status.SUSPENDED:
            raise serializers.ValidationError('Your account has been suspended.')
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = [
            'id', 'email', 'full_name', 'phone', 'role', 'status',
            'business_name', 'business_location', 'date_joined',
        ]
        read_only_fields = ['id', 'email', 'role', 'status', 'date_joined']


class AdminUserSerializer(serializers.ModelSerializer):
    """Full user details for admin panel"""
    class Meta:
        model  = User
        fields = '__all__'
        read_only_fields = ['id', 'date_joined', 'password']