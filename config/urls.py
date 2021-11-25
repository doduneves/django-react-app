from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('contact_app.urls')),

    path('', include('accounts.urls')),

]
