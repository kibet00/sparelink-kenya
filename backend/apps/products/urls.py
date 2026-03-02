from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('',                             views.ProductListView.as_view(),          name='product-list'),
    path('<int:pk>/',                    views.ProductDetailView.as_view(),        name='product-detail'),
    path('categories/',                  views.CategoryListView.as_view(),         name='categories'),
    path('<int:product_id>/reviews/',    views.ReviewCreateView.as_view(),         name='review-create'),

    # Supplier
    path('supplier/my-listings/',        views.SupplierProductListView.as_view(),  name='supplier-products'),
    path('supplier/add/',                views.SupplierProductCreateView.as_view(), name='supplier-add-product'),
    path('supplier/<int:pk>/edit/',      views.SupplierProductUpdateView.as_view(), name='supplier-edit-product'),
]