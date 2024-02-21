from rest_framework import serializers
from .models import Todo, TODO_CHOICES

class GetTodoListSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only= True)
    date_due = serializers.DateField()
    task = serializers.CharField(max_length=255)
    status = serializers.ChoiceField(TODO_CHOICES, read_only=True)
    class Meta:
        model = Todo
        fields = ["id", "task", "date_due", "status"]
    def get_id(self, obj):
        return obj.id