from django.urls import path
from .views import TaskListView, TaskView, TaskDueAndCompletedView

urlpatterns = [
    path('<int:yard_id>/add/', TaskView.as_view(), name='task-add'), # Create a new task for a specific yard
    path('<int:yard_id>/', TaskListView.as_view(), name='task-list'), # Get all tasks for a specific yard
    path('<int:yard_id>/due-and-completed/', TaskDueAndCompletedView.as_view(), name='task-due-and-completed'), # Get upcoming and recent tasks
    path('task/<int:task_id>/', TaskView.as_view(), name='task-detail'), # For get, put, delete a specific task
]