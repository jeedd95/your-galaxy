"use client";

import styles from "../../styles/nav.module.css";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  CircularProgress,
  Avatar,
  Spacer,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Progress,
  Input,
  ButtonGroup,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { GetResetTime, formattedTime } from "../../utils/time";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import { MyStarUI } from "../Modal/modal.js";
import Information from "../Navbar/information";
import { GetUserData, GiveChance } from "../api/user";

export default function App() {
  const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);

  return (
    <Navbar maxWidth="full">
      <NavbarContent justify="start">
        <Information />
      </NavbarContent>
      <NavbarContent justify="center">
        <SectionController />
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {status === "authenticated" && <SessionUI />}
          {status === "loading" && <Spacer />}
          {status === "unauthenticated" && <NullSessionUI />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );

  function SessionUI() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [userDB, setUserDB] = useState(null);

    async function fetchData() {
      const result = await GetUserData(session.user.email);
      setUserDB(result);

      await GiveChance(session.user.email);
    }

    useEffect(() => {
      fetchData();
    }, []);

    return (
      <>
        <Tooltip content="Put star chance" showArrow={true} closeDelay="500ms">
          <CircularProgress
            aria-label
            size="md"
            value={userDB ? userDB.chance : 0}
            maxValue={5}
            color="primary"
            formatOptions={{ style: "decimal" }}
            showValueLabel={true}
          />
        </Tooltip>
        <Spacer x={2} />
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              className={styles.userProfile}
              size="md"
              src={session.user.image}
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Action event example"
            // onAction={(key) => alert(key)}
          >
            <DropdownItem key="disable" className={styles.userInfo}>
              <div className={styles.label}>Nickname</div>
              {session.user.name}
              <div className={styles.label}>Chance count</div>
              {userDB ? userDB.chance : 0}
              <div className={styles.label}>Time left until get a chance</div>
              <RemainTime />
            </DropdownItem>
            <DropdownSection showDivider />
            <DropdownItem onPress={onOpen}>My Page</DropdownItem>
            <DropdownItem
              onClick={() => {
                signOut();
              }}
              color="danger"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <MyStarUI
          session={session}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          userDB={userDB}
        />
      </>
    );
  }

  function NullSessionUI() {
    return (
      <>
        <Button
          onClick={() => {
            signIn("google", { callbackUrl: "/" });
          }}
          color="primary"
          href="#"
          variant="faded"
        >
          LogIn
        </Button>
      </>
    );
  }

  function RemainTime() {
    const [remainingTime, setRemainingTime] = useState(GetResetTime().remain);

    useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTime(GetResetTime().remain);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    const formatted = formattedTime(remainingTime);

    return (
      <div>
        <Progress
          aria-label="getChanceRemain"
          size="sm"
          isStriped
          color="primary"
          maxValue={24 * 60 * 60} //86400
          value={
            24 * 60 * 60 -
            (Number(formatted.formattedHours * 60 * 60) +
              Number(formatted.formattedMinutes * 60) +
              Number(formatted.formattedSeconds))
          }
        />
        <div>
          {formatted.formattedHours}h {formatted.formattedMinutes}m{" "}
          {formatted.formattedSeconds}s
        </div>
      </div>
    );
  }

  function SectionController() {
    const router = useRouter();
    const currentPage = Number(usePathname().split("/")[1]);

    const [section, setSection] = useState(currentPage);

    return (
      <ButtonGroup>
        <Button
          onClick={() => {
            setSection((s) => s - 1);
            router.push("/" + (section - 1));
          }}
          variant="ghost"
          isIconOnly
          isDisabled={section <= 1 ? true : false}
        >
          <FaAngleLeft />
        </Button>
        <Spacer x={2} />
        <Tooltip
          color="warning"
          showArrow
          content="range : 1~999"
          offset={25}
          closeDelay="500ms"
        >
          <Input
            className={styles.input}
            color="primary"
            size="sm"
            value={section}
            style={{ textAlign: "center", color: "white" }}
            pattern="[0-9]+"
            onChange={(x) => {
              let inputNumber = Number(x.target.value);
              if (isNaN(inputNumber)) return;
              if (inputNumber.toString().length > 3) inputNumber = 999;

              setSection(inputNumber);
              router.push("/" + inputNumber);
            }}
          />
        </Tooltip>
        <Spacer x={2} />
        <Button
          onClick={() => {
            setSection((s) => s + 1);
            router.push("/" + (section + 1));
          }}
          variant="ghost"
          isIconOnly
          isDisabled={section >= 999 ? true : false}
        >
          <FaAngleRight />
        </Button>
      </ButtonGroup>
    );
  }
}
