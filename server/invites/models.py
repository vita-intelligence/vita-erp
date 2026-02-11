from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta


class Invite(models.Model):
    """
    Company invitation system.
    
    Allows existing members to invite others to join the company.
    Tracks invite status, expiration, and role assignment.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Who sent the invite
    inviter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_invites',
        help_text='User who sent the invitation'
    )
    
    # Company context
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='invites',
        help_text='Company the user is being invited to'
    )
    
    # Who is being invited (by email)
    invitee_email = models.EmailField(
        max_length=254,
        help_text='Email address of the person being invited'
    )
    
    # Optional: if invitee already has an account
    invitee_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_invites',
        help_text='User account if invitee is already registered'
    )
    
    # Role to assign upon acceptance
    role = models.ForeignKey(
        'access.Role',
        on_delete=models.CASCADE,
        related_name='invites',
        help_text='Role to assign when invitation is accepted'
    )
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    expires_at = models.DateTimeField(
        help_text='Invitation expiration date',
        db_index=True
    )
    responded_at = models.DateTimeField(null=True, blank=True)
    
    # Optional personal message
    message = models.TextField(
        blank=True,
        default='',
        max_length=500,
        help_text='Optional message from inviter'
    )
    
    class Meta:
        db_table = 'invites'
        verbose_name = 'Invite'
        verbose_name_plural = 'Invites'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'invitee_email', 'status'],
                condition=models.Q(status='pending'),
                name='uniq_pending_invite_per_email_company'
            )
        ]
        indexes = [
            models.Index(fields=['invitee_email', 'status'], name='idx_invite_email_status'),
            models.Index(fields=['company', 'status'], name='idx_invite_company_status'),
        ]
    
    def __str__(self) -> str:
        return f"{self.invitee_email} → {self.company.name} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Set expiration date (7 days from now) if not set
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    def is_expired(self) -> bool:
        """Check if invitation has expired"""
        return timezone.now() > self.expires_at and self.status == 'pending'
    
    def can_be_accepted(self) -> bool:
        """Check if invitation can still be accepted"""
        return self.status == 'pending' and not self.is_expired()
    
    def mark_expired(self):
        """Mark invitation as expired if past expiration date"""
        if self.is_expired():
            self.status = 'expired'
            self.save(update_fields=['status'])