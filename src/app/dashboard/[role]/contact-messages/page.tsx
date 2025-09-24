import ListContainer from "@/container/ListContainer/ListContainer";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";
import React from "react";
import ContactMessagesHeader from "./components/ContactMessagesHeader";
import ContactMessagesList from "./components/ContactMessagesList";

const ContactMessages = () => {
  return (
    <PermissionProvider moduleName="contact_messages">
      <ListContainer url="/dashboard/contact-messages">
        <ContactMessagesHeader />
        <ContactMessagesList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default ContactMessages;
