import axios from 'axios'//in order to make a https post request to the server
import { useContext, useState, useEffect } from "react";
import {Context} from "../context"
import {toast} from 'react-toastify'
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link'
import { useRouter } from 'next/router';


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const{state}=useContext(Context);
  const {user}=state;

  useEffect(() => {
    if(user!=null) router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      }); // axios.post takes two arguments, server url and data
      //the response object in the context of an HTTP req made using axios has some structure
      //consisting of the actual data, status code etc
      //here we are deconstructing to extract the data property from the response object
      //same as const response = await axios.post....
      // const data = response.data;
      toast.success("Registration successful. Please login."); // can avoid .success or .error //just for different colors
      setLoading(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch(err) {
    toast.error(err.response.data)
    setLoading(false);
  }
  };


  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />

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
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
            {/* if loading show the spinner else show submit */}
          </button>
        </form>

        <p className="text-center p-3">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default Register;
