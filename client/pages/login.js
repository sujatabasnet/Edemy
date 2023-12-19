import axios from "axios"; //in order to make a https post request to the server
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  //state
  const { state, dispatch } = useContext(Context);
  console.log("STATE", state);
  const { user } = state;

  //router
  const router = useRouter();

  useEffect(() => {
    if (user != null) router.push("/user");
  }, [user]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });

      dispatch({
        type: "LOGIN",
        payload: data,
      });

      //also save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      console.log(user);
      //redirect
      router.push("/user");
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
            {/* if loading show the spinner else show submit */}
          </button>
        </form>

        <p className="text-center p-3">
          Not yet registered? <Link href="/register">Register</Link>
        </p>

        <p className="text-center">
          <Link href="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
