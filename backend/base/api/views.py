from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from base.api.serializers import NoteSerializer, RegistrationSerializer
from base.models import Note

# customizing claims in JWT, added username in jwt payload
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RouteDetails(APIView):
    def get(self,request):
        route = [
            "api/token/",
            "api/token/refesh/"
        ]
        return Response(route) 
    
class NoteDetails(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        requested_user = request.user
        notes = Note.objects.filter(user = requested_user)
        print("Notes request data",request.user, request.user.id,request.user.username)
        serializer = NoteSerializer(notes,many = True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def put(self, request, id):
        note = Note.objects.get(id=id)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, id):
        note = Note.objects.get(id=id)
        note.delete()
        return Response(status=204)
    
class RegistrationView(APIView):

    def post(self,request):
        serializer = RegistrationSerializer(data=request.data)
        
        data = {}
        
        if serializer.is_valid():
            account = serializer.save()
            
            data['response'] = "Registration Successful!"
            data['username'] = account.username
            data['email'] = account.email
            
            refresh = RefreshToken.for_user(account)
            #Custom claims
            refresh["username"] = account.username
            
            data['token'] = {
                                'refresh': str(refresh),
                                'access': str(refresh.access_token),
                            }
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            data = serializer.errors
            return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
        