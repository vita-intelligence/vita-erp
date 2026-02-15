'use client';

import React, { useEffect, useRef } from 'react';
import { Input, Textarea, Button, Select, SelectItem } from '@heroui/react';
import { Package, FlaskConical, Layers, Ruler, Tag, FileText } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import BrutalistBreadcrumbs from '@/components/ui/breadcrumbs/BrutalistBreadCrumb';
import { useCreateItem, useCategories, useUnitOfMeasures } from '@/hooks/api/useItems';
import { CreateItemFormData, createItemSchema } from '@/lib/ValidationSchemas';

// ============================================================================
// ITEM TYPE OPTION
// ============================================================================

interface TypeOptionProps {
    selected: boolean;
    onSelect: () => void;
    icon: React.ReactNode;
    label: string;
    description: string;
}

function TypeOption({ selected, onSelect, icon, label, description }: TypeOptionProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex-1 flex items-start gap-3 p-4 border-2 transition-all text-left
                ${selected
                    ? 'border-black bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
        >
            <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 border-2
                ${selected ? 'border-white' : 'border-black'}`}
            >
                {icon}
            </div>
            <div>
                <p className="font-bold text-sm">{label}</p>
                <p className={`text-xs mt-0.5 ${selected ? 'text-white/70' : 'text-gray-500'}`}>
                    {description}
                </p>
            </div>
        </button>
    );
}

// ============================================================================
// PAGE
// ============================================================================

export default function ItemsCreatePage() {
    const params = useParams();
    const router = useRouter();
    const companyId = Number(params.id);

    const createItem = useCreateItem(companyId);
    const { data: categories = [], isLoading: categoriesLoading } = useCategories(companyId);
    const { data: uoms = [], isLoading: uomsLoading } = useUnitOfMeasures();

    // ── Refs ──────────────────────────────────────────────────────────────────
    const breadcrumbRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // ── Form ──────────────────────────────────────────────────────────────────
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitted },  // isSubmitted drives error visibility — works for
        // both native inputs and Controller-wrapped Selects
        // where touchedFields never fires reliably
    } = useForm<CreateItemFormData>({
        resolver: zodResolver(createItemSchema),
        mode: 'onSubmit',   // validate on submit first, then re-validate live as user fixes fields
        defaultValues: {
            item_type: 'raw',
        },
    });

    const selectedType = watch('item_type');

    // ── Animation ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const breadcrumb = breadcrumbRef.current;
        const container = containerRef.current;
        const header = headerRef.current;
        const form = formRef.current;
        if (!breadcrumb || !container || !header || !form) return;

        const formElements = form.querySelectorAll('.form-field, .form-action');

        gsap.set(breadcrumb, { opacity: 0, y: -10 });
        gsap.set(container, { opacity: 0, y: 40, scale: 0.95 });
        gsap.set(header.children, { opacity: 0, y: 20 });
        gsap.set(formElements, { opacity: 0, x: -20 });

        gsap.timeline()
            .to(breadcrumb, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
            .to(container, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }, '-=0.2')
            .to(header.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
            .to(formElements, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
    }, []);

    // ── Submit ─────────────────────────────────────────────────────────────────
    const onSubmit = (data: CreateItemFormData) => {
        createItem.mutate(
            {
                name: data.name,
                description: data.description ?? '',
                item_type: data.item_type,
                unit_of_measurement: Number(data.unit_of_measurement),
                category: data.category ? Number(data.category) : null,
            },
            {
                onSuccess: (item) => {
                    setTimeout(() => {
                        router.push(`/companies/${companyId}/items/${item.id}`);
                    }, 300);
                },
            }
        );
    };

    // ── Breadcrumbs ───────────────────────────────────────────────────────────
    const breadcrumbItems = [
        { label: 'Items', href: `/companies/${companyId}/items` },
        { label: 'New Item' },
    ];

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Breadcrumbs */}
            <div ref={breadcrumbRef} className="mb-6">
                <BrutalistBreadcrumbs items={breadcrumbItems} />
            </div>

            {/* Form container */}
            <div
                ref={containerRef}
                className="w-full max-w-2xl mx-auto bg-white border-2 border-black p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
                {/* Header */}
                <div ref={headerRef} className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center flex-shrink-0">
                            <Package className="text-white" size={20} />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-black leading-tight">
                            New Item
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Register a raw material or a manufactured BOM item
                    </p>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">

                    {/* Item type selector */}
                    <div className="form-field space-y-2">
                        <p className="text-black font-semibold text-sm sm:text-base">
                            Item Type <span className="text-red-500">*</span>
                        </p>
                        <Controller
                            name="item_type"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <TypeOption
                                        selected={field.value === 'raw'}
                                        onSelect={() => field.onChange('raw')}
                                        icon={<FlaskConical size={18} />}
                                        label="Raw Material"
                                        description="Base ingredient or input material"
                                    />
                                    <TypeOption
                                        selected={field.value === 'bom'}
                                        onSelect={() => field.onChange('bom')}
                                        icon={<Layers size={18} />}
                                        label="BOM Item"
                                        description="Manufactured from a recipe"
                                    />
                                </div>
                            )}
                        />
                        {isSubmitted && errors.item_type && (
                            <p className="text-red-500 text-xs">{errors.item_type.message}</p>
                        )}
                    </div>

                    {/* Name */}
                    <div className="form-field">
                        <Input
                            {...register('name')}
                            label="Item Name"
                            placeholder="e.g. Wheat Flour"
                            startContent={<Package className="text-gray-500 flex-shrink-0" size={18} />}
                            variant="bordered"
                            radius="none"
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={isSubmitted && !!errors.name}
                            errorMessage={errors.name?.message}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-field">
                        <Textarea
                            {...register('description')}
                            label="Description (Optional)"
                            placeholder="Brief description of this item..."
                            variant="bordered"
                            radius="none"
                            minRows={3}
                            startContent={<FileText className="text-gray-500 flex-shrink-0 mt-1" size={18} />}
                            classNames={{
                                label: "text-black font-semibold text-sm sm:text-base",
                                input: "text-black text-sm sm:text-base",
                                inputWrapper: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                            }}
                            isInvalid={isSubmitted && !!errors.description}
                            errorMessage={errors.description?.message}
                        />
                    </div>

                    {/* UOM + Category row */}
                    <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Unit of Measurement */}
                        <Controller
                            name="unit_of_measurement"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Unit of Measurement"
                                    placeholder="Select unit"
                                    variant="bordered"
                                    radius="none"
                                    isLoading={uomsLoading}
                                    startContent={<Ruler className="text-gray-500 flex-shrink-0" size={18} />}
                                    classNames={{
                                        label: "text-black font-semibold text-sm sm:text-base",
                                        value: "text-black text-sm sm:text-base",
                                        trigger: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                                    }}
                                    isInvalid={isSubmitted && !!errors.unit_of_measurement}
                                    errorMessage={errors.unit_of_measurement?.message}
                                >
                                    {uoms.map(uom => (
                                        <SelectItem key={String(uom.id)} textValue={`${uom.name} (${uom.abbreviation})`}>
                                            <span className="font-medium">{uom.name}</span>
                                            <span className="text-gray-400 font-mono text-xs ml-2">{uom.abbreviation}</span>
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />

                        {/* Category — optional, no validation needed */}
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="Category (Optional)"
                                    placeholder="Select category"
                                    variant="bordered"
                                    radius="none"
                                    isLoading={categoriesLoading}
                                    startContent={<Tag className="text-gray-500 flex-shrink-0" size={18} />}
                                    classNames={{
                                        label: "text-black font-semibold text-sm sm:text-base",
                                        value: "text-black text-sm sm:text-base",
                                        trigger: "border-2 border-black hover:border-black data-[focus=true]:border-black shadow-none",
                                    }}
                                >
                                    {categories.map(c => (
                                        <SelectItem key={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>

                    {/* BOM info hint */}
                    {selectedType === 'bom' && (
                        <div className="form-field bg-gray-50 border-2 border-black p-3 sm:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Layers className="text-black mt-0.5 flex-shrink-0" size={18} />
                                <div>
                                    <h3 className="font-bold text-black mb-1 text-sm sm:text-base">
                                        BOM Item
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        After creating this item you'll be able to add recipes — each recipe defines the ingredients and quantities needed to produce it.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="form-action flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                        <Button
                            type="button"
                            size="lg"
                            radius="none"
                            onPress={() => router.back()}
                            isDisabled={createItem.isPending}
                            className="w-full sm:flex-1 bg-white text-black font-bold text-sm sm:text-base border-2 border-black hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            radius="none"
                            isLoading={createItem.isPending}
                            className="w-full sm:flex-1 bg-black text-white font-bold text-sm sm:text-base border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                        >
                            Create Item
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}