import Input from "@/components/common/Input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center ">
        <h1>User Sign In</h1>
      </div>
      <form>
        <Input
          value={email}
          onChange={({ target }) => setemail(target.value)}
          label="Email Address"
          placeholder="het@example.com"
          type="text"
        />
        <Input
          value={password}
          onChange={({ target }) => setpassword(target.value)}
          label="Password"
          placeholder="Min 6 Characters"
          type="password"
        />

        <Button type="submit" className="btn-primary">
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default AuthLogin;
