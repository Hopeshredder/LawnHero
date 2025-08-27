from django.shortcuts import render
from rest_framework import status as s
from .models import Yard, YardGroup
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import YardSerializer, YardGroupSerializer
from users_app.views import UserPermissions

# Create your views here.
class YardView(UserPermissions, APIView):
    # get yard for user by id
    def get(self, request, yard_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            yard = Yard.objects.get(id=yard_id, user=user)
            serializer = YardSerializer(yard)
            return Response(serializer.data)
        except Yard.DoesNotExist:
            return Response({"error": "Yard not found"}, status=s.HTTP_404_NOT_FOUND)

    # update yard for user by id
    def put(self, request, yard_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            yard = Yard.objects.get(id=yard_id, user=user)
            data = request.data.copy()
            data['user'] = user.id  # Ensure the user field is set to the authenticated user
            serializer = YardSerializer(yard, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        except Yard.DoesNotExist:
            return Response({"error": "Yard not found"}, status=s.HTTP_404_NOT_FOUND)

    # delete yard for user by id
    def delete(self, request, yard_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            yard = Yard.objects.get(id=yard_id, user=user)
            yard.delete()
            return Response(status=s.HTTP_204_NO_CONTENT)
        except Yard.DoesNotExist:
            return Response({"error": "Yard not found"}, status=s.HTTP_404_NOT_FOUND)

    # create yard for user
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        # data should include yard details
        data = request.data
        # Associate the yard with the authenticated user
        data['user'] = user.id
        serializer = YardSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=s.HTTP_201_CREATED)
        return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)

class YardListView(UserPermissions, APIView):
    # get all yards for user
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        yards = Yard.objects.filter(user=user)
        serializer = YardSerializer(yards, many=True)
        if not yards.exists():
            return Response({"yards": [], "message": "No yards found for user."}, status=s.HTTP_200_OK)
        return Response(serializer.data)

class YardGroupView(UserPermissions, APIView):
    # get yard groups for user
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        yard_groups = YardGroup.objects.filter(user=user)
        serializer = YardGroupSerializer(yard_groups, many=True)
        if not yard_groups.exists():
            return Response({"yard_groups": [], "message": "No yard groups found for user."}, status=s.HTTP_200_OK)
        return Response(serializer.data)
    
    # create a yard group
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        serializer = YardGroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=s.HTTP_201_CREATED)
        return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)

    # delete yard group
    def delete(self, request, group_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            group = YardGroup.objects.get(id=group_id, user=user)
            group.delete()
            return Response(status=s.HTTP_204_NO_CONTENT)
        except YardGroup.DoesNotExist:
            return Response({"error": "Group not found or unauthorized"}, status=s.HTTP_404_NOT_FOUND)
        
    #  put to change yardgroup name
    def put(self, request, group_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            group = YardGroup.objects.get(id=group_id, user=user)
            data = request.data.copy()
            data['user'] = user.id  # Ensure the user field is set to the authenticated user
            serializer = YardGroupSerializer(group, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=s.HTTP_400_BAD_REQUEST)
        except YardGroup.DoesNotExist:
            return Response({"error": "Group not found or unauthorized"}, status=s.HTTP_404_NOT_FOUND)

class YardGroupMethodView(UserPermissions, APIView):
    # add yard to yard group
    def post(self, request, yard_id, group_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            yard = Yard.objects.get(id=yard_id, user=user)
            group = YardGroup.objects.get(id=group_id, user=user)
            yard.yard_group = group
            yard.save()
            return Response({"success": "Yard added to group"}, status=s.HTTP_201_CREATED)
        except (Yard.DoesNotExist, YardGroup.DoesNotExist):
            return Response({"error": "Yard or group not found or unauthorized"}, status=s.HTTP_404_NOT_FOUND)

    # remove yard from yard group
    def delete(self, request, yard_id, group_id):
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=s.HTTP_401_UNAUTHORIZED)
        user = request.user
        try:
            yard = Yard.objects.get(id=yard_id, user=user)
            group = YardGroup.objects.get(id=group_id, user=user)
            if yard.yard_group == group:
                yard.yard_group = None
                yard.save()
                return Response({"success": "Yard removed from group"}, status=s.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "Yard not in specified group"}, status=s.HTTP_400_BAD_REQUEST)
        except (Yard.DoesNotExist, YardGroup.DoesNotExist):
            return Response({"error": "Yard or group not found"}, status=s.HTTP_404_NOT_FOUND)