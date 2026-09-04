import AvoidKeyboard from "@/components/AvoidKeyboard";
import NowHereError from "@/components/Nowhere-Error";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const ErrorBoundary = NowHereError;

const ForgotPassword = () => {
  return (
    <AvoidKeyboard edges={["bottom"]}>
      <ForgotPasswordForm />
    </AvoidKeyboard>
  );
};

export default ForgotPassword;
