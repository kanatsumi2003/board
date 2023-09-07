import Login from "@/components/login/Login";
import { PATH } from "@/constants/common";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="p-10 h-full flex flex-col items-center gap-8">
      <Login onNext={() => navigate(PATH.DASHBOARD)} />
    </div>
  );
}

export default LoginPage;
