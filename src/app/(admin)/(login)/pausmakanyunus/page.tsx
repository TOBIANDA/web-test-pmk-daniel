import LoginPageMain from "@/features/admin/pages/login/loginPageMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Portal masuk autentikasi dan pengelolaan administrasi PMK Daniel FILKOM Universitas Brawijaya.",
};

export default function Login() {
  return <LoginPageMain />;
}