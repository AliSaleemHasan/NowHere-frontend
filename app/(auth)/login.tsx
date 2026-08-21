import { LoginForm } from "@/features/auth/components/LoginForm";
import { View } from "react-native";

const Login = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      <LoginForm />
    </View>
  );
};

export default Login;
