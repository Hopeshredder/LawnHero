import os
from openai import OpenAI

from .prompt_helpers import build_user_prompt

from users_app.views import UserPermissions

from yard_app.models import Yard
from yard_app.serializers import YardSerializer

# Create your views here.
"""
Call from frontend to POST 
[] Get yard info
[] Get yard prefs
[] Pass both to serializer
[] serializer returns dictionary
[] run serialized_data.is_valid()
[] store serialized_data.validated_data to 'item'
[] 

"""
SYSTEM_PROMPT = (
    # TODO: ADD SYSTEM PROMPT
)


class AISuperTipsView(UserPermissions):
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def get(self, request, yard_id):
        data = request.data.copy()
        yard_info = Yard.objects.get(id=data.get(""))
        yard_info = YardSerializer(yard_info).data

        user_prompt = build_user_prompt()


class SuperTips(UserPermissions):
    def post(self, request, yard_id):
        pass

    def get(self, request, yard_id):
        pass
