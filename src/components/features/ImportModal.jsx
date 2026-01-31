import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Replace, GitMerge } from 'lucide-react';

import { validateImportData, importTransactions } from '../../services/dataTransfer';
import { Button, Modal } from '../ui';

const STEPS = {
    SELECT_FILE: 'select',
    VALIDATING: 'validating',
    CHOOSE_MODE: 'choose',
    IMPORTING: 'importing',
    SUCCESS: 'success',
    ERROR: 'error',
};

const ImportModal = ({ onClose, onImportComplete }) => {
    const [step, setStep] = useState(STEPS.SELECT_FILE);
    const [validationResult, setValidationResult] = useState(null);
    const [importResult, setImportResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            setError('Seuls les fichiers JSON sont acceptés');
            setStep(STEPS.ERROR);
            return;
        }

        setStep(STEPS.VALIDATING);

        try {
            const text = await file.text();
            const result = validateImportData(text);
            setValidationResult(result);

            if (result.valid) {
                setStep(STEPS.CHOOSE_MODE);
            } else {
                setError(null);
                setStep(STEPS.ERROR);
            }
        } catch {
            setError('Impossible de lire le fichier');
            setStep(STEPS.ERROR);
        }
    };

    const handleImport = (mode) => {
        if (!validationResult?.data?.transactions) return;

        setStep(STEPS.IMPORTING);

        try {
            const result = importTransactions(validationResult.data.transactions, mode);
            setImportResult(result);
            setStep(STEPS.SUCCESS);
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'import');
            setStep(STEPS.ERROR);
        }
    };

    const handleClose = () => {
        if (step === STEPS.SUCCESS) {
            onImportComplete?.();
        }
        onClose();
    };

    const resetAndRetry = () => {
        setStep(STEPS.SELECT_FILE);
        setValidationResult(null);
        setImportResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Modal title="Importer des données" onClose={handleClose}>
            {step === STEPS.SELECT_FILE && (
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>

                    <p className="text-secondary-600 dark:text-secondary-400 text-center mb-6">
                        Sélectionnez un fichier d'export zFinance (.json)
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="import-file"
                    />

                    <Button
                        variant="primary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Choisir un fichier
                    </Button>
                </div>
            )}

            {step === STEPS.VALIDATING && (
                <div className="flex flex-col items-center py-8">
                    <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Validation des données...
                    </p>
                </div>
            )}

            {step === STEPS.CHOOSE_MODE && validationResult && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 mb-6">
                        <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        <div>
                            <p className="font-medium text-secondary-900 dark:text-white">
                                {validationResult.data.count} transactions trouvées
                            </p>
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                Export du {new Date(validationResult.data.exportedAt).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>

                    <p className="text-secondary-700 dark:text-secondary-300 font-medium mb-4">
                        Comment voulez-vous importer ces données ?
                    </p>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => handleImport('replace')}
                            className="
                                w-full p-4 rounded-xl text-left
                                bg-white/70 dark:bg-secondary-800/70
                                border border-secondary-200/50 dark:border-secondary-700/50
                                hover:border-primary-300 dark:hover:border-primary-600
                                hover:bg-primary-50/50 dark:hover:bg-primary-900/20
                                transition-colors
                                group cursor-pointer
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                    <Replace className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        Remplacer tout
                                    </p>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                        Supprime les données existantes et les remplace par l'import
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleImport('merge')}
                            className="
                                w-full p-4 rounded-xl text-left
                                bg-white/70 dark:bg-secondary-800/70
                                border border-secondary-200/50 dark:border-secondary-700/50
                                hover:border-primary-300 dark:hover:border-primary-600
                                hover:bg-primary-50/50 dark:hover:bg-primary-900/20
                                transition-colors
                                group cursor-pointer
                            "
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                                    <GitMerge className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-secondary-900 dark:text-white">
                                        Fusionner
                                    </p>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                        Ajoute les nouvelles transactions, ignore les doublons (même ID)
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {step === STEPS.IMPORTING && (
                <div className="flex flex-col items-center py-8">
                    <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                    <p className="text-secondary-600 dark:text-secondary-400">
                        Import en cours...
                    </p>
                </div>
            )}

            {step === STEPS.SUCCESS && importResult && (
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                        <CheckCircle className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                        Import réussi
                    </h3>

                    <div className="text-center text-secondary-600 dark:text-secondary-400 mb-6">
                        <p>{importResult.imported} transaction{importResult.imported > 1 ? 's' : ''} importée{importResult.imported > 1 ? 's' : ''}</p>
                        {importResult.skipped > 0 && (
                            <p className="text-sm mt-1">
                                {importResult.skipped} doublon{importResult.skipped > 1 ? 's' : ''} ignoré{importResult.skipped > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <Button variant="primary" onClick={handleClose}>
                        Fermer
                    </Button>
                </div>
            )}

            {step === STEPS.ERROR && (
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                        {error ? 'Erreur' : 'Données invalides'}
                    </h3>

                    {error ? (
                        <p className="text-secondary-600 dark:text-secondary-400 text-center mb-6">
                            {error}
                        </p>
                    ) : validationResult?.errors && (
                        <div className="w-full max-h-40 overflow-y-auto mb-6">
                            <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                                {validationResult.errors.map((err, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="shrink-0">•</span>
                                        <span>{err}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleClose}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={resetAndRetry}>
                            Réessayer
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ImportModal;
