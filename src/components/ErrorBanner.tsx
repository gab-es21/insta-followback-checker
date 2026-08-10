export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="error-banner" role="alert" aria-live="assertive">
      {message}
    </div>
  );
}
