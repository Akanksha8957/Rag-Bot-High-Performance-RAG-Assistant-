from rest_framework import serializers
from .models import Document, ChatSession, ChatMessage

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'user', 'file', 'name', 'uploaded_at']
        read_only_fields = ['user', 'uploaded_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'session', 'role', 'content', 'timestamp']
        read_only_fields = ['timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'title', 'created_at', 'messages']
        read_only_fields = ['user', 'created_at', 'messages']
