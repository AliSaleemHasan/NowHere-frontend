import AvoidKeyboard from "@/components/AvoidKeyboard";
import { LoginForm } from "@/features/auth/components/LoginForm";

const Login = () => {
  return (
    <AvoidKeyboard>
      <LoginForm />
    </AvoidKeyboard>
  );
};

export default Login;
