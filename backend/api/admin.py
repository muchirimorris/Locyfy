from django.contrib import admin
from .models import Venue, EventLocation, Amenity, EventCategory

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(EventLocation)
class EventLocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'subCounty', 'county', 'terrain')
    list_filter = ('county', 'terrain')

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'pricePerDay', 'capacity', 'isLocyfyVerified')
    list_filter = ('isLocyfyVerified',)
    search_fields = ('name', 'description')
