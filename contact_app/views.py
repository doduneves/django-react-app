from django.conf import settings
from django.core.mail import BadHeaderError, send_mail
from django.http.response import JsonResponse
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404

from .models import Contact
from .serializers import ContactSerializer

def send_confirmation_mail(owner, contact_name, contact_email):
    try:
        message = f'Hey there,\n\n'
        message += f'User "{owner}" added new contacts to the list:\n'
        message += f'- {contact_name} - {contact_email}\n'
        message += '\n\n\n---\n'
        message += 'VContacts Teams'

        send_mail(
            'New Vcontacts Added',
            message,
            settings.CONFIRMATION_MAIL_SENDER,
            settings.CONFIRMATION_MAIL_LIST,
            fail_silently=False,
        )
    except BadHeaderError as e:
        print(e)
        pass


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = (IsAuthenticated,)


    def create(self, request, *args, **kwargs):
        if request.user.is_staff:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            if settings.SEND_CONFIRMATION_MAIL == "True":
                send_confirmation_mail(request.user, serializer.data['name'], serializer.data['email'])

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return JsonResponse({'message':'User is not authorized to perform this action'}, status=status.HTTP_401_UNAUTHORIZED)


    def destroy(self, request, *args, **kwargs):
        try:
            if request.user.is_superuser:
                instance = self.get_object()
                self.perform_destroy(instance)
            else:
                return JsonResponse({'message':'User is not authorized to perform this action'}, status=status.HTTP_401_UNAUTHORIZED)

        except Http404:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)