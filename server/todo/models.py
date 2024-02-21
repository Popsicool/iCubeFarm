from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

# Create your models here.
TODO_CHOICES = [
    ("PENDING",  "Task scheduled for the future"),
    ("COMPLETED",  "Task has marked as completed"),
    ("EXPIRED",  "Task date as elapsed"),
]


class Todo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.CharField(max_length=255, blank=False)
    date_due = models.DateField(null=True)
    status = models.CharField(
        max_length=255,
        choices= TODO_CHOICES,
        default= TODO_CHOICES[0][0]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.task} by {self.owner.first_name}'