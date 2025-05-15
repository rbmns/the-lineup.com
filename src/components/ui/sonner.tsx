
// Empty implementation of Sonner toaster
type ToasterProps = React.ComponentProps<any>

const Toaster = ({ ...props }: ToasterProps) => {
  // Return an empty div - no toasts will be shown
  return <div data-sonner-toaster style={{ display: 'none' }} />;
};

export { Toaster }
