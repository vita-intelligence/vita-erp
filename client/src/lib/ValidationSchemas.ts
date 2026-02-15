import { z } from 'zod';

// ============================================================================
// LOGIN VALIDATION SCHEMA
// ============================================================================

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email')
        .max(254, 'Email is too long'), // Django EmailField max_length
    
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// REGISTRATION VALIDATION SCHEMA
// ============================================================================

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email')
        .max(254, 'Email is too long'), // Django EmailField max_length
    
    username: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(
            /^[a-zA-Z0-9_]+$/,
            'Username can only contain letters, numbers, and underscores'
        ),
    
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error will be on confirmPassword field
});

export type RegisterFormData = z.infer<typeof registerSchema>;


// ============================================================================
// COMPANY NAME
// ============================================================================


export const companySchema = z.object({
    name: z
        .string()
        .min(1, 'Company name is required')
        .max(255, 'Company name is too long')
        .regex(
            /^[\w\s&.,'()+\-\/]+$/,
            'Company name contains invalid characters'
        ),
    description: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;


// ============================================================================
// COMPANY INVITATIONS
// ============================================================================

export const inviteSchema = z.object({
    invitee_email: z
        .string()
        .email('Invalid email address')
        .max(254, 'Email is too long'),
    role: z
        .string()
        .min(1, 'Please select a role'),
    message: z
        .string()
        .max(500, 'Message is too long')
        .optional(),
});

export type InviteFormData = z.infer<typeof inviteSchema>;


// ============================================================================
// ITEMS
// ============================================================================

export const createItemSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(255, 'Name must be under 255 characters'),
    description: z
        .string()
        .max(750, 'Description must be under 750 characters')
        .optional(),
    item_type: z.enum(['raw', 'bom'], {
        message: 'Please select an item type',
    }),
    unit_of_measurement: z
        .string()
        .min(1, 'Unit of measurement is required'),
    category: z.string().optional(),
});

export type CreateItemFormData = z.infer<typeof createItemSchema>;


// ============================================================================
// SUPPLIERS
// ============================================================================

export const createSupplierSchema = z.object({
    name:        z.string().min(1, { message: 'Supplier name is required' }).max(255),
    description: z.string().max(1000).optional(),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;