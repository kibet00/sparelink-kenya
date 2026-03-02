"""
SpareLink Kenya - Custom User Model
Roles: Buyer, Supplier, Admin
"""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        BUYER    = 'buyer',    'Buyer'
        SUPPLIER = 'supplier', 'Supplier'
        ADMIN    = 'admin',    'Admin'

    class Status(models.TextChoices):
        ACTIVE               = 'active',   'Active'
        PENDING_VERIFICATION = 'pending',  'Pending Verification'
        SUSPENDED            = 'suspended','Suspended'

    # Core fields
    email      = models.EmailField(unique=True)
    full_name  = models.CharField(max_length=150)
    phone      = models.CharField(max_length=15)
    role       = models.CharField(max_length=10, choices=Role.choices, default=Role.BUYER)
    status     = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    # Supplier-specific fields
    business_name     = models.CharField(max_length=200, blank=True)
    business_location = models.CharField(max_length=200, blank=True)
    id_document       = models.FileField(upload_to='verification/', blank=True, null=True)

    # System fields
    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone']

    class Meta:
        db_table        = 'users'
        verbose_name    = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def is_buyer(self):
        return self.role == self.Role.BUYER

    @property
    def is_supplier(self):
        return self.role == self.Role.SUPPLIER

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN

    @property
    def is_verified_supplier(self):
        return self.role == self.Role.SUPPLIER and self.status == self.Status.ACTIVE