import { Box, Flex, IconButton } from "@radix-ui/themes";
import { AvatarIcon, ExitIcon } from "@radix-ui/react-icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { doc, updateDoc } from "firebase/firestore";
import db from "@/app/db";
import { useEffect } from "react";

const Auth = () => {
  const { data: session } = useSession();
  const editUserEmail = async (email) => {
    const dbref = doc(db, "workspaces", localStorage.getItem("workspace"));
    await updateDoc(dbref, {
      userEmail: email,
    });
  };

  useEffect(() => {
    if (session && session.user) {
      editUserEmail(session.user.email);
    }
  }, []);

  if (session && session.user) {
    return (
      <IconButton
        style={{
          cursor: "pointer",
        }}
        size="4"
        variant="soft"
        color="gray"
        onClick={() => signOut()}
      >
        <ExitIcon />
      </IconButton>
    );
  }

  return (
    <>
      <IconButton
        style={{
          cursor: "pointer",
        }}
        size="4"
        variant="soft"
        color="gray"
        onClick={() => {
          signIn();
        }}
      >
        <AvatarIcon />
      </IconButton>
    </>
  );
};

export default Auth;
