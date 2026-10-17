'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { WeightEntry } from '@/types/weight';
import { WEIGHT_MIN, WEIGHT_MAX } from '@/lib/weightService';
import ExerciseFields from './ExerciseFields';

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      'Modal compound subcomponents must be rendered within a <Modal> root.',
    );
  }
  return context;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div
        className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 animate-in fade-in duration-200'
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        role='dialog'
        aria-modal='true'
      >
        <div
          className={`w-full ${maxWidth} bg-white border border-neutral-200 dark:bg-[#202020] dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 transition-colors`}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

export interface ModalHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  showCloseButton?: boolean;
}

function ModalHeader({
  title,
  description,
  children,
  showCloseButton = true,
}: ModalHeaderProps) {
  const { onClose } = useModalContext();

  return (
    <div className='flex items-start justify-between p-5 border-b border-neutral-200 dark:border-neutral-800'>
      <div className='space-y-1'>
        {title && (
          <h3 className='text-lg font-bold text-neutral-900 dark:text-white tracking-tight'>
            {title}
          </h3>
        )}
        {description && (
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>
            {description}
          </p>
        )}
        {children}
      </div>

      {showCloseButton && (
        <button
          onClick={onClose}
          className='text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 p-1 rounded-lg transition cursor-pointer'
          aria-label='Close'
        >
          ✕
        </button>
      )}
    </div>
  );
}

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div
      className={`p-4 bg-neutral-50 border-t border-neutral-200 dark:bg-[#191919] dark:border-neutral-800 flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

function ModalDelete({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete entry?',
  description = 'If you delete, this data cannot be recovered',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
}: ModalDeleteProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='max-w-sm'>
      <ModalHeader
        title={
          <span className='flex items-center gap-2 text-neutral-900 dark:text-white'>
            <Trash2
              className='w-5 h-5 text-neutral-900 dark:text-white'
              strokeWidth={2}
            />{' '}
            {title}
          </span>
        }
      />
      <ModalBody>
        <p className='text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed'>
          {description}
        </p>
      </ModalBody>
      <ModalFooter>
        <button
          type='button'
          onClick={onClose}
          disabled={isDeleting}
          className='px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 dark:hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 transition cursor-pointer'
        >
          {cancelText}
        </button>
        <button
          type='button'
          onClick={onConfirm}
          disabled={isDeleting}
          className='px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition active:scale-[0.98] disabled:opacity-50 cursor-pointer'
        >
          {isDeleting ? 'Deleting...' : confirmText}
        </button>
      </ModalFooter>
    </Modal>
  );
}

export interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  entry: WeightEntry | null;
  onSave: (updatedData: {
    weight: number;
    date: string;
    didExercise: boolean;
    exerciseDetails: string;
  }) => void;
  title?: string;
}

function ModalEditForm({
  entry,
  onClose,
  onSave,
  title,
}: Omit<ModalEditProps, 'isOpen'>) {
  const [weight, setWeight] = useState<string>(
    entry ? String(entry.weight) : '',
  );
  const [date, setDate] = useState<string>(entry?.date ?? '');
  const [didExercise, setDidExercise] = useState<boolean>(
    Boolean(entry?.didExercise),
  );
  const [exerciseDetails, setExerciseDetails] = useState<string>(
    entry?.exerciseDetails || '',
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const num = parseFloat(weight);
    if (isNaN(num) || num < WEIGHT_MIN || num > WEIGHT_MAX) {
      alert(
        `Please enter a valid weight between ${WEIGHT_MIN} and ${WEIGHT_MAX} kg.`,
      );
      return;
    }

    onSave({
      weight: num,
      date,
      didExercise,
      exerciseDetails: didExercise ? exerciseDetails.trim() : '',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader
        title={
          <span className='flex items-center gap-2 text-neutral-900 dark:text-white'>
            <Pencil
              className='w-5 h-5 text-neutral-900 dark:text-white'
              strokeWidth={2}
            />{' '}
            {title}
          </span>
        }
        description='Update your measurement and physical activity details'
      />

      <ModalBody className='space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
              Weight (kg)
            </label>
            <input
              type='number'
              step='0.1'
              min={WEIGHT_MIN}
              max={WEIGHT_MAX}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className='w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1'>
              Date
            </label>
            <input
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className='w-full bg-white border border-neutral-300 focus:border-neutral-900 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition dark:bg-[#191919] dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300'
            />
          </div>
        </div>

        <ExerciseFields
          didExercise={didExercise}
          exerciseDetails={exerciseDetails}
          onDidExerciseChange={setDidExercise}
          onExerciseDetailsChange={setExerciseDetails}
          label='Did exercises?'
          placeholder='e.g. 5km run, weightlifting...'
          compact
        />
      </ModalBody>

      <ModalFooter>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 dark:hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 transition cursor-pointer'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-4 py-2 rounded-xl text-xs font-bold text-white dark:text-neutral-900 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white transition active:scale-[0.98] cursor-pointer'
        >
          Save Changes
        </button>
      </ModalFooter>
    </form>
  );
}

function ModalEdit({
  isOpen,
  onClose,
  entry,
  onSave,
  title = 'Edit Weight Log',
}: ModalEditProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth='max-w-md'>
      <ModalEditForm
        key={entry?.id ?? 'empty'}
        entry={entry}
        onClose={onClose}
        onSave={onSave}
        title={title}
      />
    </Modal>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Delete = ModalDelete;
Modal.Edit = ModalEdit;
