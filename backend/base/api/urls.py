from django.urls import path
from base.api import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("",views.RouteDetails.as_view(),name='route-details'),
    path("user/register/",views.RegistrationView.as_view() , name='register'),
    path("notes/",views.NoteDetails.as_view(),name='note-details'),#GET, POST
    path("notes/<int:id>",views.NoteDetails.as_view(),name='note-details'),
    path("token/",views.MyTokenObtainPairView.as_view(),name='get-token'),
    path("token/refresh/",TokenRefreshView.as_view(),name='get-refresh-token'),
]

