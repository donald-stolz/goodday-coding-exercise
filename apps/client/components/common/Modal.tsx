import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  className = '',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements?.[0];
    const last = focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (
        e.key === 'Tab' &&
        focusableElements &&
        focusableElements.length > 0
      ) {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first element
    first?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white p-8 rounded shadow-lg min-w-[300px] ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
