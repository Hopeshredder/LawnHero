from django.shortcuts import render
from rest_framework import status as s
from .models import Task
from rest_framework.response import Response
from .serializers import TaskSerializer
from users_app.views import UserPermissions
import datetime


# Create your views here.
class TaskView(UserPermissions):
    # create a task for a yard
    def post(self, request, yard_id):
        # user = request.user
        data = request.data.copy()
        data["yard"] = yard_id  # Ensure the yard field is set to the provided yard_id
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=s.HTTP_201_CREATED)
        return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)

    # get A task
    def get(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=s.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=s.HTTP_404_NOT_FOUND)

    # put edit task
    def put(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            serializer = TaskSerializer(instance=task, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=s.HTTP_200_OK)
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=s.HTTP_404_NOT_FOUND)

    # delete a task
    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return Response(status=s.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=s.HTTP_404_NOT_FOUND)


class TaskListView(UserPermissions):
    # get all tasks for a yard
    def get(self, request, yard_id):
        tasks = Task.objects.filter(yard=yard_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=s.HTTP_200_OK)

class TaskDueAndCompletedView(UserPermissions):
    # get 10 tasks coming due and 10 tasks last completed, returned as separate arrays
    def get(self, request, yard_id):
        upcoming_tasks = Task.objects.filter(yard=yard_id, day_scheduled__gte=datetime.date.today()).order_by('day_scheduled')[:10]
        recent_tasks = Task.objects.filter(yard=yard_id, day_completed__isnull=False).order_by('-day_completed')[:10]
        upcoming_serializer = TaskSerializer(upcoming_tasks, many=True)
        recent_serializer = TaskSerializer(recent_tasks, many=True)
        return Response({
            "upcoming_tasks": upcoming_serializer.data,
            "recent_tasks": recent_serializer.data
        }, status=s.HTTP_200_OK)
    
