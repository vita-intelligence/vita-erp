'use client';

import React from 'react';
import { Chip } from '@heroui/react';
import { FlaskConical, Layers, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Item } from '@/lib/api/items';

interface ItemCardProps {
    item: Item;
    companyId: number;
}

export function ItemCard({ item, companyId }: ItemCardProps) {
    return (
        <Link
            href={`/companies/${companyId}/items/${item.id}`}
            className="group block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150"
        >
            <div className="flex items-center gap-4 p-4">

                {/* Type icon */}
                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center flex-shrink-0
                    ${item.item_type === 'bom' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                >
                    {item.item_type === 'bom'
                        ? <Layers size={18} />
                        : <FlaskConical size={18} />
                    }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-black text-sm truncate">{item.name}</span>
                        {!item.is_active && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-300 px-1.5 py-0.5">
                                Inactive
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {/* Type badge */}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border
                            ${item.item_type === 'bom'
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-black'}`}
                        >
                            {item.item_type === 'bom' ? 'BOM' : 'Raw'}
                        </span>

                        {/* UOM */}
                        <span className="text-xs text-gray-500 font-mono">{item.uom}</span>

                        {/* Category */}
                        {item.category_name && (
                            <span className="text-xs text-gray-500">{item.category_name}</span>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <p className="text-xs text-gray-400 mt-1 truncate">{item.description}</p>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight
                    size={18}
                    className="text-gray-300 group-hover:text-black transition-colors flex-shrink-0"
                />
            </div>
        </Link>
    );
}