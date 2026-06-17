from rest_framework import serializers
from .models import Venue, EventLocation, Amenity, EventCategory, Booking, Transaction, VenueImage, VenuePackage

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

class VenueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = ['id', 'image_url']

class VenuePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenuePackage
        fields = ['id', 'name', 'description', 'price', 'features']

class VenueSerializer(serializers.ModelSerializer):
    locations = EventLocationSerializer(many=True, read_only=True)
    # Flatten Amenities into a list of strings
    amenities = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    images = VenueImageSerializer(many=True, read_only=True)
    packages = VenuePackageSerializer(many=True, read_only=True)

    class Meta:
        model = Venue
        fields = [
            'id', 
            'name', 
            'description', 
            'imageUrl', 
            'locations', 
            'pricePerDay', 
            'capacity', 
            'isLocyfyVerified', 
            'mlRecommendationScore', 
            'amenities',
            'images',
            'packages'
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
