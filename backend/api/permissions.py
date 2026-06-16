from rest_framework import permissions

class IsVendor(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'vendor' role to access an endpoint.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        return hasattr(request.user, 'profile') and request.user.profile.role == 'vendor'
