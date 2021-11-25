from django.contrib import admin

from .models import Contact

# Register your models here.
class Contacts(admin.ModelAdmin):
    list_display = ('id', 'name', 'email')
    list_display_links = ('id', 'name')
    search_fields = ('nome', 'email')

admin.site.register(Contact, Contacts)