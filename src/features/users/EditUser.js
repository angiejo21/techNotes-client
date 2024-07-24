import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import useTitle from "../../hooks/useTitle";

function EditUser() {
  useTitle("techNotes | Edit User");
  const { id } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });
  if (!user) return <PulseLoader color={"#FFF"} />;

  const content = <EditUserForm user={user} />;
  return content;
}

export default EditUser;
