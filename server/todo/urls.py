from django.urls import path
from . import views


urlpatterns = [
    path('todos/', views.ListTodosView.as_view(), name='kyc_verification'),
    path('single_todos/<str:id>', views.SingleTodo.as_view(), name='kyc_verification'),
    # path('mark_as_complete/<str:id>', views.ListTodosView.as_view(), name='kyc_verification'),
]