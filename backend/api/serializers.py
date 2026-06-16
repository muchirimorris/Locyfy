from rest_framework import serializers
from .models import Venue, EventLocation, Amenity, EventCategory, Booking, Transaction

class EventLocationSerializer(serializers.ModelSerializer):
    # Flatten the M2M IdealFor categories into a list of strings
    idealFor = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = EventLocation
        fields = ['id', 'name', 'subCounty', 'county', 'idealFor', 'terrain']

class VenueSerializer(serializers.ModelSerializer):
    # Nested EventLocation
    eventLocation = EventLocationSerializer(read_only=True)
    # Flatten Amenities into a list of strings
    amenities = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )

    class Meta:
        model = Venue
        fields = [
            'id', 
            'name', 
            'description', 
            'imageUrl', 
            'eventLocation', 
            'pricePerDay', 
            'capacity', 
            'isLocyfyVerified', 
            'mlRecommendationScore', 
            'amenities'
        ]

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
