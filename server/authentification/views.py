from rest_framework import (permissions, generics,filters)
from rest_framework.response import Response
from rest_framework import status
from .serializers import (LoginSerializer, SignupSerializer)
from .models import CustomUserManager
from rest_framework.views import APIView
from django.db import transaction
from django.contrib.auth import get_user_model

User = get_user_model()


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response( serializer.data, status=status.HTTP_200_OK)

class SignupView(generics.GenericAPIView):
    serializer_class = SignupSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        users = User.objects.filter(email=serializer.validated_data['email'])
        if len(users) > 0:
            return Response({
                "status_code": 400,
                "error": "User already exists",
                "payload": []
            }, status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


