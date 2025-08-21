import AvoidKeyboard from "@/components/AvoidKeyboard";
import { SignupForm } from "@/features/auth/components/SignupForm";

const Signup = () => {
  return (
    <AvoidKeyboard>
      <SignupForm />
    </AvoidKeyboard>
  );
};

export default Signup;
