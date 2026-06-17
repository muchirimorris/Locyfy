from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Sum
from .models import Venue, EventLocation, Booking, Transaction, UserProfile, VenueImage, VenuePackage
from .serializers import VenueSerializer, EventLocationSerializer, BookingSerializer
from .permissions import IsVendor
import time
import uuid

class EventLocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLocation.objects.all()
    serializer_class = EventLocationSerializer

class VenueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        # role could be 'user' or 'vendor'
        role = request.data.get('role', 'user')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=email).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        UserProfile.objects.create(user=user, role=role)

        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = 'customer'
        if hasattr(request.user, 'profile'):
            role = request.user.profile.role
            
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'role': role
        })

class ProcessPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        venue_id = request.data.get('venue_id')
        booking_date = request.data.get('booking_date')
        total_amount = request.data.get('total_amount')
        payment_method = request.data.get('payment_method', 'M-PESA')

        if not all([venue_id, booking_date, total_amount]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            venue = Venue.objects.get(id=venue_id)
        except Venue.DoesNotExist:
            return Response({'error': 'Venue not found'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Create Booking
        booking = Booking.objects.create(
            user=request.user,
            venue=venue,
            booking_date=booking_date,
            status='Confirmed',
            total_amount=total_amount
        )

        # 2. Simulate M-PESA delay (we'll just do a brief sleep to mimic a real transaction)
        time.sleep(1.5)

        # 3. Create Transaction
        transaction = Transaction.objects.create(
            booking=booking,
            payment_method=payment_method,
            amount=total_amount,
            payment_status='Completed',
            transaction_reference=f"LOCYFY-{uuid.uuid4().hex[:8].upper()}"
        )

        serializer = BookingSerializer(booking)
        return Response({
            'message': 'Payment successful and booking confirmed!',
            'booking': serializer.data
        }, status=status.HTTP_201_CREATED)

class VendorDashboardView(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        # Find venues owned by this user
        vendor_venues = Venue.objects.filter(vendor=request.user)
        # Find bookings for these venues
        bookings = Booking.objects.filter(venue__in=vendor_venues)
        
        total_revenue = bookings.filter(status='Confirmed').aggregate(total=Sum('total_amount'))['total'] or 0
        pending_bookings = bookings.filter(status='Pending').count()
        upcoming_bookings = bookings.filter(status='Confirmed').count()

        return Response({
            'total_revenue': total_revenue,
            'pending_bookings': pending_bookings,
            'upcoming_bookings': upcoming_bookings,
            'total_venues': vendor_venues.count()
        })

class VendorBookingsView(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        vendor_venues = Venue.objects.filter(vendor=request.user)
        bookings = Booking.objects.filter(venue__in=vendor_venues).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class VendorVenueCreateView(APIView):
    permission_classes = [IsVendor]

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description', '')
        imageUrl = request.data.get('imageUrl')
        pricePerDay = request.data.get('pricePerDay')
        capacity = request.data.get('capacity')
        
        # EventLocation data
        county = request.data.get('county')
        subCounty = request.data.get('subCounty')
        terrain = request.data.get('terrain')

        if not all([name, imageUrl, pricePerDay, capacity, county, subCounty, terrain]):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Get or create the EventLocation
        location_name = f"{subCounty} Grounds" # Arbitrary default name for location
        event_location, created = EventLocation.objects.get_or_create(
            county=county,
            subCounty=subCounty,
            terrain=terrain,
            defaults={'name': location_name}
        )

        # 2. Create the Venue
        venue = Venue.objects.create(
            vendor=request.user,
            name=name,
            description=description,
            imageUrl=imageUrl,
            eventLocation=event_location,
            pricePerDay=pricePerDay,
            capacity=capacity,
            isLocyfyVerified=False
        )

        # 3. Create Images
        images = request.data.get('images', [])
        for img_url in images:
            if img_url:
                VenueImage.objects.create(venue=venue, image_url=img_url)

        # 4. Create Packages
        packages = request.data.get('packages', [])
        for pkg in packages:
            VenuePackage.objects.create(
                venue=venue,
                name=pkg.get('name'),
                description=pkg.get('description', ''),
                price=pkg.get('price', 0),
                features=pkg.get('features', [])
            )

        serializer = VenueSerializer(venue)
        return Response({
            'message': 'Venue created successfully!',
            'venue': serializer.data
        }, status=status.HTTP_201_CREATED)

class CustomerBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
