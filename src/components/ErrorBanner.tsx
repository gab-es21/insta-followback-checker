import { AlertIcon } from './icons';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      <AlertIcon aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
