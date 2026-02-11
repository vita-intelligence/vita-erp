from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Invite
from .serializers import (
    InviteCreateSerializer,
    InviteListSerializer,
    InviteDetailSerializer
)
from .pagination import InvitePagination
from companies.models import Company
from access.models import Membership
from access.services.permissions import membership_has_perm


class CompanyInviteCreateView(generics.CreateAPIView):
    """
    Create a new invitation to join the company.
    
    Requires 'members.invite' permission.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InviteCreateSerializer
    
    def get_company(self):
        company_id = self.kwargs.get('company_id')
        return get_object_or_404(Company, id=company_id)
    
    def get_membership(self):
        company = self.get_company()
        return get_object_or_404(
            Membership,
            user=self.request.user,
            company=company,
            is_active=True
        )
    
    def post(self, request, *args, **kwargs):
        company = self.get_company()
        membership = self.get_membership()
        
        # Check permission
        if not membership_has_perm(membership, 'members.invite'):
            return Response(
                {'detail': 'You do not have permission to invite members.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(
            data=request.data,
            context={'company': company}
        )
        serializer.is_valid(raise_exception=True)
        
        # Create invite
        invite = serializer.save(
            inviter=request.user,
            company=company
        )
        
        # TODO: Send invitation email here
        # send_invitation_email(invite)
        
        return Response(
            InviteDetailSerializer(invite).data,
            status=status.HTTP_201_CREATED
        )


class CompanySentInvitesView(generics.ListAPIView):
    """
    List all invitations sent by the company.
    
    Available to company members with 'members.view' permission.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InviteListSerializer
    pagination_class = InvitePagination
    
    def get_company(self):
        company_id = self.kwargs.get('company_id')
        return get_object_or_404(Company, id=company_id)
    
    def get_membership(self):
        company = self.get_company()
        return get_object_or_404(
            Membership,
            user=self.request.user,
            company=company,
            is_active=True
        )
    
    def get_queryset(self):
        company = self.get_company()
        membership = self.get_membership()
        
        # Check permission
        if not membership_has_perm(membership, 'members.view'):
            return Invite.objects.none()
        
        return Invite.objects.filter(company=company).select_related(
            'inviter', 'company', 'role'
        )


class MyReceivedInvitesView(generics.ListAPIView):
    """
    List all invitations received by the current user.
    
    Shows pending invitations for the user's email.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InviteListSerializer
    pagination_class = InvitePagination
    
    def get_queryset(self):
        return Invite.objects.filter(
            invitee_email=self.request.user.email,
            status='pending'
        ).select_related('inviter', 'company', 'role')


class InviteAcceptView(APIView):
    """
    Accept a pending invitation.
    
    Creates membership and assigns role.
    """
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request, invite_id):
        invite = get_object_or_404(
            Invite,
            id=invite_id,
            invitee_email=request.user.email
        )
        
        # Validate invite can be accepted
        if not invite.can_be_accepted():
            return Response(
                {'detail': 'This invitation cannot be accepted.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already a member
        if Membership.objects.filter(
            user=request.user,
            company=invite.company,
            is_active=True
        ).exists():
            return Response(
                {'detail': 'You are already a member of this company.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create membership
        membership, created = Membership.objects.get_or_create(
            user=request.user,
            company=invite.company,
            defaults={'is_active': True}
        )
        
        # If membership existed but was inactive, reactivate it
        if not created and not membership.is_active:
            membership.is_active = True
            membership.save()
        
        # Assign role
        from access.models import MembershipRole
        MembershipRole.objects.get_or_create(
            membership=membership,
            role=invite.role
        )
        
        # Update invite status
        invite.status = 'accepted'
        invite.invitee_user = request.user
        invite.responded_at = timezone.now()
        invite.save()
        
        return Response({
            'detail': 'Invitation accepted successfully.',
            'company': {
                'id': invite.company.id,
                'name': invite.company.name,
            }
        }, status=status.HTTP_200_OK)


class InviteDeclineView(APIView):
    """
    Decline a pending invitation.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, invite_id):
        invite = get_object_or_404(
            Invite,
            id=invite_id,
            invitee_email=request.user.email,
            status='pending'
        )
        
        invite.status = 'declined'
        invite.invitee_user = request.user
        invite.responded_at = timezone.now()
        invite.save()
        
        return Response(
            {'detail': 'Invitation declined.'},
            status=status.HTTP_200_OK
        )


class InviteCancelView(APIView):
    """
    Cancel a pending invitation (inviter or admin only).
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, invite_id):
        invite = get_object_or_404(Invite, id=invite_id)
        
        # Get membership
        membership = get_object_or_404(
            Membership,
            user=request.user,
            company=invite.company,
            is_active=True
        )
        
        # Check if user is inviter or has admin permission
        is_inviter = invite.inviter == request.user
        has_permission = membership_has_perm(membership, 'members.manage')
        
        if not (is_inviter or has_permission):
            return Response(
                {'detail': 'You do not have permission to cancel this invitation.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if invite.status != 'pending':
            return Response(
                {'detail': 'Only pending invitations can be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        invite.status = 'cancelled'
        invite.save()
        
        return Response(
            {'detail': 'Invitation cancelled.'},
            status=status.HTTP_200_OK
        )

from django.utils import timezone