import { useContext } from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";

const UserIndex = () => {

  const {state} = useContext(Context);
  const {user} = state;


  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">
      User Dashboard
      </h1>
    </UserRoute>
  );
};

export default UserIndex;
