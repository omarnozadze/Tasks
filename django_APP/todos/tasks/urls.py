from django.urls import path,include
from .views import TasksView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'',TasksView,'Task')

urlpatterns = [
    path('',include(router.urls)),
    path('tasks/', TasksView.as_view({'post': 'create'}), name='create-task'),
]
