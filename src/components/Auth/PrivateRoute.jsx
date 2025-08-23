// src/components/Auth/PrivateRoute.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api";

export default function PrivateRoute() {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        // use apiRequest with refresh handling
        await apiRequest("auth/validate");
        if (active) {
          setIsAuthed(true);
        }
      } catch (err) {
        // if even refresh fails → user really isn’t authenticated
        if (active) {
          setIsAuthed(false);
          navigate("/login");
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    checkAuth();

    return () => {
      active = false; // avoid setting state after unmount
    };
  }, [navigate]);

  if (checking) return <div>Checking authentication...</div>;

  return isAuthed ? <Outlet /> : null;
}
