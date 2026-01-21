import { Check } from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';

const TransactionItem = ({ amount, description, category, date, status }) => {
    const isPending = status === 'pending';

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
                        <Badge label={category} capitalize />
                        <span className="hidden xs:block text-slate-300 dark:text-slate-600">•</span>
                        <span>
                            {formatDate(date, '', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
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
            </div>
        </li>
    );
}
export default TransactionItem