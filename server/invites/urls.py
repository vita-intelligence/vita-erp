from django.urls import path
from .views import (
    CompanyInviteCreateView,
    CompanySentInvitesView,
    MyReceivedInvitesView,
    InviteAcceptView,
    InviteDeclineView,
    InviteCancelView,
)

urlpatterns = [
    # Company-scoped invite endpoints
    path(
        'companies/<int:company_id>/create/',
        CompanyInviteCreateView.as_view(),
        name='company-invite-create'
    ),
    path(
        'companies/<int:company_id>/sent/',
        CompanySentInvitesView.as_view(),
        name='company-sent-invites'
    ),
    
    # User-scoped endpoints
    path(
        'received/',
        MyReceivedInvitesView.as_view(),
        name='my-received-invites'
    ),
    path(
        '<int:invite_id>/accept/',
        InviteAcceptView.as_view(),
        name='invite-accept'
    ),
    path(
        '<int:invite_id>/decline/',
        InviteDeclineView.as_view(),
        name='invite-decline'
    ),
    path(
        '<int:invite_id>/cancel/',
        InviteCancelView.as_view(),
        name='invite-cancel'
    ),
]