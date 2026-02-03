from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, ChatSessionViewSet, ChatViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'sessions', ChatSessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
    path('ask/', ChatViewSet.as_view({'post': 'ask'}), name='chat-ask'),
    path('history/<int:pk>/', ChatViewSet.as_view({'get': 'history'}), name='chat-history'),
]
