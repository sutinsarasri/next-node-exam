"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import { createUser } from "@/services/serverService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const editActionBtn = async () => {
    const result = await createUser();
    if (result.data.status) {
      Swal.fire(
        "Create success",
        JSON.stringify(result?.data?.data),
        "success"
      );
    } else {
      Swal.fire("Failed!", result?.error?.message, "error");
    }
  };
  return (
    <main className={styles.main}>
      <div>
        <Button variant="contained" onClick={editActionBtn}>
          Cate User Login
        </Button>
        <Button sx={{marginLeft: 10, backgroundColor:'green'}} variant="contained" onClick={() => router.push("/login")}>
          Login
        </Button>
      </div>
    </main>
  );
}
