import { UserContext } from "./UserContext";
import { useUser } from "../hooks/useUser";

const UserProvider = ({ children }) => {
  const user = useUser(); // 👈 핵심

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
