from rest_framework import serializers
from .models import Invite
from access.models import Role
from companies.models import Company


class InviteCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new invitations"""
    
    class Meta:
        model = Invite
        fields = ['id', 'invitee_email', 'role', 'message', 'expires_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'expires_at']
    
    def validate_role(self, value):
        """Ensure role belongs to the company"""
        company = self.context.get('company')
        if value.company != company:
            raise serializers.ValidationError("Role does not belong to this company.")
        return value
    
    def validate_invitee_email(self, value):
        """Validate email and check for existing membership"""
        company = self.context.get('company')
        
        # Check if user already has active membership
        from access.models import Membership
        from users.models import User
        
        try:
            user = User.objects.get(email=value)
            if Membership.objects.filter(
                user=user,
                company=company,
                is_active=True
            ).exists():
                raise serializers.ValidationError(
                    "This user is already a member of the company."
                )
        except User.DoesNotExist:
            pass  # Email not registered yet, that's fine
        
        # Check for existing pending invite
        if Invite.objects.filter(
            company=company,
            invitee_email=value,
            status='pending'
        ).exists():
            raise serializers.ValidationError(
                "A pending invitation already exists for this email."
            )
        
        return value


class InviteListSerializer(serializers.ModelSerializer):
    """Serializer for listing invitations"""
    
    inviter_name = serializers.CharField(source='inviter.username', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    role_name = serializers.CharField(source='role.name', read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Invite
        fields = [
            'id',
            'inviter_name',
            'company_name',
            'company',
            'invitee_email',
            'role_name',
            'role',
            'status',
            'message',
            'created_at',
            'expires_at',
            'responded_at',
            'is_expired'
        ]
        read_only_fields = fields
    
    def get_is_expired(self, obj):
        return obj.is_expired()


class InviteDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all information"""
    
    inviter = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = Invite
        fields = [
            'id',
            'inviter',
            'company',
            'invitee_email',
            'role',
            'status',
            'message',
            'created_at',
            'expires_at',
            'responded_at',
            'is_expired'
        ]
    
    def get_inviter(self, obj):
        return {
            'id': obj.inviter.id,
            'username': obj.inviter.username,
            'email': obj.inviter.email,
        }
    
    def get_company(self, obj):
        return {
            'id': obj.company.id,
            'name': obj.company.name,
            'description': obj.company.description,
        }
    
    def get_role(self, obj):
        return {
            'id': obj.role.id,
            'name': obj.role.name,
            'description': obj.role.description,
        }
    
    def get_is_expired(self, obj):
        return obj.is_expired()