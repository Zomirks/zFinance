import { useState } from 'react';
import { Check, SquarePen, ChevronLeft, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';

import { formatCurrency, formatDate } from '../../utils/formatters';
import {Badge, Button, Modal} from '../ui';

const TransactionItem = ({ id, amount, description, category, date, status, onDelete, onEdit }) => {
    const isPending = status === 'pending';
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
                            onClick={() => setShowDeleteConfirmation(true)}>
                            <Trash2 size={16} />
                        </span>
                    </div>
                )}

                {showDeleteConfirmation && (
                    <Modal onClose={() => setShowDeleteConfirmation(false)}>
                        <div className='flex flex-col items-center text-center'>
                            <div className='w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4'>
                                <AlertTriangle className='w-6 h-6 text-red-600 dark:text-red-400' />
                            </div>

                            <p className='text-slate-600 dark:text-slate-300 mb-4'>
                                Cette action est irréversible. Voulez-vous vraiment supprimer cette transaction ?
                            </p>

                            <div className='w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'>
                                <p className='font-medium text-slate-900 dark:text-white'>{description}</p>
                                <div className='flex items-center justify-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400'>
                                    <span>{formatDate(date)}</span>
                                    <span>•</span>
                                    <span className={amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                        {amount >= 0 ? '+' : ''}{formatCurrency(amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 mt-6'>
                            <Button
                                variant='secondary'
                                onClick={() => setShowDeleteConfirmation(false)}
                            >Annuler</Button>

                            <Button
                                variant='danger'
                                onClick={() => onDelete?.(id)}
                            >Supprimer</Button>
                        </div>
                    </Modal>
                )}
            </div>
        </li>
    );
}
export default TransactionItem