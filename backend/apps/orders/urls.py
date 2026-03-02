from django.urls import path
from . import views

urlpatterns = [
    path('place/',                 views.PlaceOrderView.as_view(),       name='place-order'),
    path('my-orders/',             views.BuyerOrderListView.as_view(),   name='buyer-orders'),
    path('<int:pk>/',              views.OrderDetailView.as_view(),      name='order-detail'),
    path('<int:order_id>/status/', views.UpdateOrderStatusView.as_view(), name='update-status'),
]