from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task


class TasksView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()



