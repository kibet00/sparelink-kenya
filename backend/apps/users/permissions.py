"""
SpareLink Kenya - Custom Permissions
"""

from rest_framework.permissions import BasePermission
from .models import User


class IsAdminUser(BasePermission):
    """Only admin role users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.ADMIN


class IsSupplier(BasePermission):
    """Only verified suppliers"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == User.Role.SUPPLIER and
            request.user.status == User.Status.ACTIVE
        )


class IsBuyer(BasePermission):
    """Only buyers"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.BUYER


class IsOwnerOrAdmin(BasePermission):
    """Object-level: owner or admin only"""
    def has_object_permission(self, request, view, obj):
        if request.user.role == User.Role.ADMIN:
            return True
        return obj == request.user