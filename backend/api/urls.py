from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VenueViewSet, EventLocationViewSet, SignupView, ProcessPaymentView, VendorDashboardView, VendorBookingsView, VendorVenueCreateView

router = DefaultRouter()
router.register(r'venues', VenueViewSet)
router.register(r'locations', EventLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('bookings/process_payment/', ProcessPaymentView.as_view(), name='process_payment'),
    path('vendor/dashboard/', VendorDashboardView.as_view(), name='vendor_dashboard'),
    path('vendor/bookings/', VendorBookingsView.as_view(), name='vendor_bookings'),
    path('vendor/venues/', VendorVenueCreateView.as_view(), name='vendor_venues_create'),
]
