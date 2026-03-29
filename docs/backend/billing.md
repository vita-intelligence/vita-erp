# Billing

## Pricing Model

```
monthly_cost = base_price (plan)
             + sum(per-user permission costs)
             + sum(quota overages)
             + sum(active add-on prices)
```

### Four pillars

1. **Base platform fee** — flat monthly/annual cost per plan tier
2. **Per-user permission pricing** — each permission (module + action) has its own price. More permissions = higher cost per user. Defined per plan in `PermissionPrice`
3. **Quota overages** — flexible limits (storage, sessions, users, API calls) with overage pricing via `PlanLimit`
4. **Add-ons** — optional module extensions purchased separately

## Models (central DB)

### Plan

Defines a billing tier (Free Trial, Starter, Pro, Enterprise).

| Field | Type | Description |
|---|---|---|
| `name` | CharField(100) | Display name |
| `slug` | SlugField(50) | Unique identifier |
| `base_price_monthly` | Decimal(10,2) | Flat monthly fee |
| `base_price_annual` | Decimal(10,2) | Flat annual fee |
| `is_trial` | Boolean | Whether this is a trial plan |
| `trial_duration_days` | Integer | Trial length |
| `stripe_product_id` | CharField | Stripe Product ID (future) |
| `stripe_price_id_monthly` | CharField | Stripe monthly Price ID (future) |
| `stripe_price_id_annual` | CharField | Stripe annual Price ID (future) |

### PlanModuleAccess

Which modules a plan grants access to. Module codes are plain strings — no central enum.

### PlanLimit

Generic quota system. New limit types added as rows, not model fields.

| Field | Type | Description |
|---|---|---|
| `plan` | FK(Plan) | |
| `limit_code` | CharField(50) | e.g., `max_users`, `storage_gb`, `sessions_per_user` |
| `included_quantity` | Decimal(15,4) | Free with the plan |
| `max_quantity` | Decimal(15,4) | Hard cap (null = unlimited) |
| `price_per_extra` | Decimal(10,4) | Cost per unit above included |
| `per_org` | Boolean | True = org-wide, False = per-user |

### PermissionPrice

Per-permission pricing. Each module + action combination has its own price per plan.

| Field | Type | Description |
|---|---|---|
| `plan` | FK(Plan) | Prices differ per plan |
| `module_code` | CharField(50) | e.g., `inventory` |
| `action` | CharField(30) | e.g., `read`, `write`, `delete` |
| `price_monthly` | Decimal(10,4) | Monthly cost for this permission |

### AddOn

Optional purchasable extras on top of a plan.

### Subscription

One-to-one with Organization. Tracks current plan, billing cycle, trial dates.

Status values mirror Stripe: `trialing`, `active`, `past_due`, `canceled`, `unpaid`, `paused`, `incomplete`.

Stripe-ready fields: `stripe_subscription_id`, `stripe_customer_id`.

### SubscriptionAddOn

Active add-ons attached to a subscription. Stripe-ready: `stripe_subscription_item_id`.

## Trial Plan (seeded)

| Setting | Value |
|---|---|
| Duration | 14 days |
| Base price | $0 |
| Max users | 3 (hard cap) |
| Storage | 1 GB (hard cap) |
| Sessions per user | 1 (hard cap) |
| Modules | All (trial includes everything) |

## Stripe Integration (future)

All models include Stripe ID fields. The mapping:

| Our model | Stripe concept |
|---|---|
| Plan | Product + Price |
| Subscription | Subscription |
| SubscriptionAddOn | Subscription Item |
| Permission/quota overages | Metered usage reporting |

Status values are identical to Stripe's lifecycle — no translation layer needed.
