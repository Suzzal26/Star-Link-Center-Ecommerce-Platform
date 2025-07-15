import { Outlet } from "react-router-dom";

import UserNavbar from "./UserNavbar";
import UserFooter from "./UserFooter";
import MessengerChatButton from "../components/MessengerChatButton";
import "./UserLayout.css";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <UserNavbar />
      <main className="user-layout-main">
        <Outlet />
      </main>
      <UserFooter />
      <MessengerChatButton />
    </div>
  );
};

export default UserLayout;
