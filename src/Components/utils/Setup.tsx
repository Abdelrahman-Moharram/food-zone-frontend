import { useRetrieveUserQuery } from "../../redux/features/authApiSlice";
import { NotificationContainer } from "../Notifications";

export default function Setup() {
  useRetrieveUserQuery();
  return <NotificationContainer />;
}

