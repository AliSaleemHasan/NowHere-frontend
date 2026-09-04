import AvoidKeyboard from "@/components/AvoidKeyboard";
import NowHereError from "@/components/Nowhere-Error";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const ErrorBoundary = NowHereError;

const ResetPassword = () => {
  return (
    <AvoidKeyboard>
      <ResetPasswordForm />
    </AvoidKeyboard>
  );
};

export default ResetPassword;
