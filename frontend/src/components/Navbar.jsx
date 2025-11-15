import { Link, useNavigate, useLocation } from "react-router";
import { PlusIcon, LogOutIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // hide logout on the auth page
  const onAuthPage = location.pathname === "/auth";

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            Notendo
          </h1>

          {/* Right side buttons */}
          {!onAuthPage && (
            <div className="flex items-center gap-4">
              <Link to={"/create"} className="btn btn-primary">
                <PlusIcon className="size-5" />
                <span>New Note</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-outline btn-error">
                <LogOutIcon className="size-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
