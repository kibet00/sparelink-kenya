from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/',  views.RegisterView.as_view(),  name='register'),
    path('login/',     views.LoginView.as_view(),     name='login'),
    path('logout/',    views.LogoutView.as_view(),    name='logout'),
    path('profile/',   views.ProfileView.as_view(),   name='profile'),

    # Admin
    path('admin/all/',                   views.AdminUserListView.as_view(),       name='admin-users'),
    path('admin/verify/<int:user_id>/',  views.AdminVerifySupplierView.as_view(), name='admin-verify'),
    path('admin/suspend/<int:user_id>/', views.AdminSuspendUserView.as_view(),    name='admin-suspend'),
]