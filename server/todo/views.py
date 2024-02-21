from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework import (permissions, generics,filters)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from utils.pagination import CustomPagination
from .serializers import GetTodoListSerializer
from django.db import transaction
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Todo
from django.utils import timezone
from datetime import datetime
import re

# Create your views here.

def is_valid_date_format(date_string):
    pattern = re.compile(r'^\d{4}-\d{2}-\d{2}$')
    return bool(pattern.match(date_string))
current_date = timezone.now()

class ListTodosView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GetTodoListSerializer
    pagination_class = CustomPagination
    queryset = Todo.objects.all().order_by("-created_at")
    filter_backends = [filters.SearchFilter]
    search_fields = ["task"]
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('status', openapi.IN_QUERY, description='filter by status',
                              type=openapi.TYPE_STRING, required=False, enum=["PENDING", "COMPLETED", "EXPIRED"]),
            openapi.Parameter('start_date', openapi.IN_QUERY, description='Start date (YYYY-MM-DD)', type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('end_date', openapi.IN_QUERY, description='End date (YYYY-MM-DD)', type=openapi.TYPE_STRING, required=False),
        ]
    )
    def get(self, request):
        user = request.user
        self.queryset.filter(owner=user, date_due__lt=current_date).update(status="EXPIRED")
        queryset = self.queryset.filter(owner=user)
        param = self.request.query_params.get('status', None)
        param2 = self.request.query_params.get('start_date', None)
        param3 = self.request.query_params.get('end_date', None)
        if param2 and not is_valid_date_format(param2):
            return Response(data = {'error': 'Invalid start date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        if param3 and not is_valid_date_format(param3):
            return Response(data = {'error': 'Invalid end date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        if param:
            param = param.strip().upper()
            queryset = queryset.filter(status=param)
        if param2:
            start_date = datetime.strptime(param2, '%Y-%m-%d')
            if timezone.is_naive(start_date):
                start_date = timezone.make_aware(start_date, timezone.get_default_timezone())
            queryset = queryset.filter(created_at__gte=start_date)
        if param3:
            end_date = datetime.strptime(param3, '%Y-%m-%d')
            if timezone.is_naive(end_date):
                end_date = timezone.make_aware(end_date, timezone.get_default_timezone())
            queryset = queryset.filter(created_at__lte=end_date)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        user = request.user
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save(owner = user)
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class SingleTodo(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GetTodoListSerializer
    def get(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, pk=id)
        if todo.owner != user:
            return Response(data={"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.serializer_class(instance=todo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def patch(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, pk=id)
        if todo.owner != user:
            return Response(data={"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        data = request.data
        serializer = self.serializer_class(instance= todo, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            serializer.save()
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    def delete(self, request, id):
        user = request.user
        todo = get_object_or_404(Todo, pk=id)
        if todo.owner != user:
            return Response(data={"message": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MarkCompleteSerializer(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        todo = get_object_or_404(Todo, pk=id)
        user = request.user
        if todo.owner != user:
            return Response(data={"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        with transaction.atomic():
            todo.status = "COMPLETED"
            todo.save()
        return Response({"data":"Success"}, status=status.HTTP_200_OK)

class MarkUnCompleteSerializer(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        todo = get_object_or_404(Todo, pk=id)
        user = request.user
        if todo.owner != user:
            return Response(data={"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        with transaction.atomic():
            todo.status = "UPCOMING"
            todo.save()
        return Response({"data":"Success"}, status=status.HTTP_200_OK)