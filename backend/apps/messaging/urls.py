from django.urls import path
from . import views

urlpatterns = [
    path('send/',                 views.SendMessageView.as_view(),   name='send-message'),
    path('inbox/',                views.InboxView.as_view(),         name='inbox'),
    path('thread/<int:user_id>/', views.ConversationView.as_view(),  name='conversation'),
]