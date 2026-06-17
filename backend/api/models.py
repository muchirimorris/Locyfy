from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.user.username} - {self.role}"
class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class EventCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name

class EventLocation(models.Model):
    COUNTY_CHOICES = [
        ('Nairobi', 'Nairobi'),
        ('Nyeri', 'Nyeri'),
        ('Kiambu', 'Kiambu'),
        ('Nakuru', 'Nakuru'),
        ('Mombasa', 'Mombasa'),
    ]
    
    TERRAIN_CHOICES = [
        ('Manicured Gardens', 'Manicured Gardens'),
        ('Indoor Hall', 'Indoor Hall'),
        ('Rooftop', 'Rooftop'),
        ('Lakeside', 'Lakeside'),
        ('Forest', 'Forest'),
    ]

    venue = models.ForeignKey('Venue', on_delete=models.CASCADE, related_name="locations", null=True, blank=True)
    name = models.CharField(max_length=200)
    subCounty = models.CharField(max_length=100)
    county = models.CharField(max_length=100, choices=COUNTY_CHOICES)
    idealFor = models.ManyToManyField(EventCategory, related_name="locations")
    terrain = models.CharField(max_length=100, choices=TERRAIN_CHOICES)

    def __str__(self):
        return f"{self.name} - {self.subCounty}, {self.county}"

class Venue(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_venues", null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    imageUrl = models.URLField(max_length=500)
    pricePerDay = models.DecimalField(max_digits=12, decimal_places=2)
    capacity = models.PositiveIntegerField()
    isLocyfyVerified = models.BooleanField(default=False)
    mlRecommendationScore = models.IntegerField(null=True, blank=True, help_text="Percentage 0-100")
    amenities = models.ManyToManyField(Amenity, related_name="venues", blank=True)

    def __str__(self):
        return self.name

class VenueImage(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField(max_length=500)

    def __str__(self):
        return f"Image for {self.venue.name}"

class VenuePackage(models.Model):
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="packages")
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    features = models.JSONField(default=list)

    def __str__(self):
        return f"{self.name} - {self.venue.name}"
class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name="bookings")
    location = models.ForeignKey(EventLocation, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    booking_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.venue.name} by {self.user.username}"

class Transaction(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('M-PESA', 'M-PESA'),
        ('Card', 'Card'),
    ]
    STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Pending', 'Pending'),
    ]

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="transaction")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    transaction_reference = models.CharField(max_length=100, blank=True, null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Txn {self.transaction_reference} - {self.payment_status}"

