from django.shortcuts import render

from users_app.views import UserPermissions


# Create your views here.
class SuperTips(UserPermissions):
    def post(self, request, yard_id):
        pass

    def get(self, request, yard_id):
        pass