from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Only admin role users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsSupplier(BasePermission):
    """Only verified suppliers"""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'supplier' and
            request.user.status == 'active'
        )


class IsBuyer(BasePermission):
    """Only buyers"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'buyer'


class IsOwnerOrAdmin(BasePermission):
    """Object-level: owner or admin only"""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj == request.user