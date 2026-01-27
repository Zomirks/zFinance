import { useState } from 'react';
import { Check, SquarePen, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';

const TransactionItem = ({ id, amount, description, category, date, status, onDelete, onEdit }) => {
    const isPending = status === 'pending';
    const [showActionMenu, setShowActionMenu] = useState(false);

    return (
        <li className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex justify-between xs:items-center xs:justify-start gap-2">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{description}</p>
                        {isPending ? (
                            <Badge
                                label='en attente...'
                                variant='warning'
                            />
                        ) : (
                            <Check
                                size={12}
                                strokeWidth={3} className='text-slate-400'
                            />
                        )}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400 xs:justify-start">
                        <span>{category}</span>
                        <span className="hidden xs:block text-slate-300 dark:text-slate-600">•</span>
                        <span className='text-slate-500 dark:text-slate-400'>
                            {formatDate(date, '', {
                                day: 'numeric',
                                month: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
                <span
                    className={`text-center text-lg font-semibold shrink-0 xs:text-end ${amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
                >
                    {amount >= 0 ? '+' : ''}
                    {formatCurrency(amount)}
                </span>

                <span
                    className='text-slate-500 cursor-pointer hover:text-slate-700 transition'
                    onClick={() => setShowActionMenu(!showActionMenu)}>
                    {showActionMenu ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </span>

                {showActionMenu && (
                    <div className='flex transition gap-x-3'>
                        <span
                            className='text-slate-500 cursor-pointer hover:text-slate-700 transition'
                            onClick={() => onEdit?.(id)}>
                            <SquarePen size={16} />
                        </span>
                        <span
                            className='text-slate-500 cursor-pointer hover:text-slate-700 transition'
                            onClick={() => onDelete?.(id)}>
                            <Trash2 size={16} />
                        </span>
                    </div>
                )}
            </div>
        </li>
    );
}
export default TransactionItem