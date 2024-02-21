from django.utils import timezone
import re
from rest_framework import serializers
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(
        max_length=68, min_length=8, write_only=True)
    first_name = serializers.CharField(
        max_length=255, min_length=3, read_only=True)
    last_name = serializers.CharField(
        max_length=255, min_length=3, read_only=True)
    class Meta:
        model = User
        fields = ['id','email', 'password', 'tokens', 'first_name', 'last_name']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        user = auth.authenticate(email=email, password=password)
        if not user:
            raise AuthenticationFailed('invalid credentials, try again')
        return {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'tokens': user.tokens,
        }

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=8, max_length=68, write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'password', 'email']

    def validate(self, attrs):
        first_name = attrs.get('firstname', '')
        last_name = attrs.get('lastname', '')
        password = attrs.get('password', '')
        email = attrs.get('email', "")

        if not email:
            raise serializers.ValidationError("email is compulsory")
        # if not first_name.isalpha():
        #     raise serializers.ValidationError("firstname must contain alphabets only")
        # if not last_name.isalpha():
        #     raise serializers.ValidationError("lastname must contain alphabets only")

        if re.search('[A-Z]', password) is None:
            raise serializers.ValidationError("password must contain One Uppercase Alphabet")

        if re.search('[a-z]', password) is None:
            raise serializers.ValidationError("password must contain One Lowercase Alphabet")

        if re.search('[0-9]', password) is None:
            raise serializers.ValidationError("password must contain One Numeric Character")

        if re.search(r"[@$!%*#?&]", password) is None:
            raise serializers.ValidationError("password must contain One Special Character")
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


