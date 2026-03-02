from django.urls import path
from . import views

urlpatterns = [
    path('<int:order_id>/pay/', views.InitiatePaymentView.as_view(), name='pay-order'),
]