"""
SpareLink Kenya - User Views
"""
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserProfileSerializer, AdminUserSerializer
)
from .permissions import IsAdminUser


class RegisterView(generics.CreateAPIView):
    """Register a new buyer or supplier"""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        message = 'Registration successful. Please login.'
        if user.role == User.Role.SUPPLIER:
            message = 'Registration successful. Your account is pending admin verification.'

        return Response({'message': message}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Login and receive JWT tokens"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id':       user.id,
                'email':    user.email,
                'fullName': user.full_name,
                'role':     user.role,
                'status':   user.status,
            }
        })


class LogoutView(APIView):
    """Blacklist the refresh token on logout"""
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'})
        except Exception:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get and update own profile"""
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


# ─── Admin Views ─────────────────────────────────────────────────────────────

class AdminUserListView(generics.ListAPIView):
    """Admin: List all users"""
    serializer_class   = AdminUserSerializer
    permission_classes = [IsAdminUser]
    queryset           = User.objects.all().order_by('-date_joined')


class AdminVerifySupplierView(APIView):
    """Admin: Approve or reject a supplier"""
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        action = request.data.get('action')
        try:
            supplier = User.objects.get(id=user_id, role=User.Role.SUPPLIER)
        except User.DoesNotExist:
            return Response({'error': 'Supplier not found.'}, status=status.HTTP_404_NOT_FOUND)

        if action == 'approve':
            supplier.status = User.Status.ACTIVE
            supplier.save()
            return Response({'message': f'{supplier.full_name} has been verified.'})
        elif action == 'reject':
            supplier.status = User.Status.SUSPENDED
            supplier.save()
            return Response({'message': f'{supplier.full_name} has been rejected.'})
        else:
            return Response({'error': 'Invalid action. Use approve or reject.'}, status=400)


class AdminSuspendUserView(APIView):
    """Admin: Suspend or reinstate a user"""
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.status == User.Status.SUSPENDED:
            user.status = User.Status.ACTIVE
            user.save()
            return Response({'message': f'{user.full_name} has been reinstated.'})
        else:
            user.status = User.Status.SUSPENDED
            user.save()
            return Response({'message': f'{user.full_name} has been suspended.'})
        
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response(
                {'detail': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully.'})