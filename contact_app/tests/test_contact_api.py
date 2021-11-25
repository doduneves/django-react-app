import json

from django.contrib.auth.models import User
from django.http import response
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.test import APITestCase

from ..models import Contact
from ..serializers import ContactSerializer


class UserAPIViewTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='qwe123')
        self.user.is_staff = True
        self.user.is_superuser = True
        self.user.save()

        self.token = AccessToken.for_user(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')


    def tearDown(self):
        pass


    def _post_contact(self):
        data = {
            "name": "New Contact",
            "email": "new@contact.com"
        }
        res = self.client.post('/api/contacts/', data, format='json')
        return res

    def test_request_with_authenticated(self):
        res = self.client.get('/api/contacts/')
        self.assertEquals(res.status_code, status.HTTP_200_OK)


    def test_request_without_authenticated(self):
        self.client.force_authenticate(user=None, token=None)
        res = self.client.get('/api/contacts/')
        self.assertEquals(res.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_post_new_contact(self):
        res = self._post_contact()
        self.assertEquals(res.status_code, status.HTTP_201_CREATED)


    def test_unauthorized_post_new_contact(self):
        self.user.is_staff = False
        self.user.save()
        res = self._post_contact()
        self.assertEquals(res.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_get_contacts_list(self):
        res = self.client.get('/api/contacts/')
        self.assertEquals(res.status_code, status.HTTP_200_OK)


    def test_post_and_get_contacts_list(self):
        _ = self._post_contact()
        res = self.client.get('/api/contacts/')
        expected_data = [
            {
                "id": 1,
                "name": "New Contact",
                "email": "new@contact.com"
            },
        ]

        self.assertEquals(res.data, expected_data)


    def test_post_and_get_contact(self):
        contact_id = 1
        _ = self._post_contact()
        res = self.client.get(f'/api/contacts/{contact_id}/')
        expected_data = {
                "id": 1,
                "name": "New Contact",
                "email": "new@contact.com"
            }

        self.assertEquals(res.data, expected_data)


    def test_post_delete_and_get_contact(self):
        contact_id = 1
        # POST
        _ = self._post_contact()

        # DELETE
        res = self.client.delete(f'/api/contacts/{contact_id}/')

        self.assertEquals(res.status_code, status.HTTP_204_NO_CONTENT)

        # Try to GET
        res = self.client.get(f'/api/contacts/{contact_id}/')

        self.assertEquals(res.status_code, status.HTTP_404_NOT_FOUND)


    def test_unauthorize_delete(self):
        contact_id = 1

        self.user.is_superuser = False
        self.user.save()

        res = self.client.delete(f'/api/contacts/{contact_id}/')

        self.assertEquals(res.status_code, status.HTTP_401_UNAUTHORIZED)
