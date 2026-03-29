"""
Billing constants — subscription statuses, billing cycles.

Status names align with Stripe's subscription lifecycle so the future
Stripe integration maps directly without translation layers.
"""

# ---------------------------------------------------------------------------
# Subscription statuses (mirrors Stripe subscription.status)
# ---------------------------------------------------------------------------

SUB_STATUS_TRIALING = "trialing"
SUB_STATUS_ACTIVE = "active"
SUB_STATUS_PAST_DUE = "past_due"
SUB_STATUS_CANCELED = "canceled"
SUB_STATUS_UNPAID = "unpaid"
SUB_STATUS_PAUSED = "paused"
SUB_STATUS_INCOMPLETE = "incomplete"

SUB_STATUS_CHOICES = [
    (SUB_STATUS_TRIALING, "Trialing"),
    (SUB_STATUS_ACTIVE, "Active"),
    (SUB_STATUS_PAST_DUE, "Past Due"),
    (SUB_STATUS_CANCELED, "Canceled"),
    (SUB_STATUS_UNPAID, "Unpaid"),
    (SUB_STATUS_PAUSED, "Paused"),
    (SUB_STATUS_INCOMPLETE, "Incomplete"),
]

# Statuses that grant access to the organization
SUB_ACCESSIBLE_STATUSES = {SUB_STATUS_TRIALING, SUB_STATUS_ACTIVE, SUB_STATUS_PAST_DUE}

# ---------------------------------------------------------------------------
# Billing cycles (maps to Stripe price.recurring.interval)
# ---------------------------------------------------------------------------

BILLING_CYCLE_MONTHLY = "monthly"
BILLING_CYCLE_ANNUAL = "annual"

BILLING_CYCLE_CHOICES = [
    (BILLING_CYCLE_MONTHLY, "Monthly"),
    (BILLING_CYCLE_ANNUAL, "Annual"),
]

# ---------------------------------------------------------------------------
# Trial
# ---------------------------------------------------------------------------

TRIAL_DURATION_DAYS = 14

# ---------------------------------------------------------------------------
# Audit actions (logged to central platform_audit.AuditLog)
# ---------------------------------------------------------------------------

AUDIT_SUBSCRIPTION_CREATED = "subscription_created"
AUDIT_PLAN_CHANGED = "plan_changed"
AUDIT_ADD_ON_ACTIVATED = "add_on_activated"
AUDIT_ADD_ON_DEACTIVATED = "add_on_deactivated"
AUDIT_BILLING_CYCLE_CHANGED = "billing_cycle_changed"
