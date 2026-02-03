from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Document, ChatSession, ChatMessage
from .serializers import DocumentSerializer, ChatSessionSerializer, ChatMessageSerializer
from .utils import process_document, get_rag_response

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
        # Process document (extract text and index)
        success = process_document(document)
        if not success:
            # Handle error (optional: delete document or mark as failed)
            pass

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def ask(self, request):
        question = request.data.get('question')
        session_id = request.data.get('session_id')
        
        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create session
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            session = ChatSession.objects.create(user=request.user, title=question[:50])
        
        # Save user message
        ChatMessage.objects.create(session=session, role='user', content=question)
        
        # Get RAG response
        answer = get_rag_response(request.user, question)
        
        # Save bot message
        ChatMessage.objects.create(session=session, role='bot', content=answer)
        
        return Response({
            "answer": answer,
            "session_id": session.id,
            "session_title": session.title
        })

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        try:
            session = ChatSession.objects.get(id=pk, user=request.user)
        except ChatSession.DoesNotExist:
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        
        messages = session.messages.all().order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
