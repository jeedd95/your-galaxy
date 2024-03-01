"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
  Spacer,
  Tab,
  Tabs,
} from "@nextui-org/react";
import StarUi from "../Star/starUi";
import { GetUserStars } from "../api/star";
import UserUi from "../User/userUi";

export function MyStarUI(props) {
  const p = JSON.parse(JSON.stringify(props));
  const userData = p.userDB;
  let stars;
  let container = [];
  const [components, setComponents] = useState([]);
  const [starCount, setStarCount] = useState(0);
  // const [userData, setUserData] = useState(null);

  async function fetchData() {
    stars = await GetUserStars(p.session.user.email);
    // setUserData(await GetUserData(p.session.user.email));
    setStarCount(stars.length);

    stars.map((star, index) => {
      container.push(
        <div key={index}>
          <StarUi starData={star} />
          <Spacer y={3} />
        </div>
      );
    });
    setComponents(container);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalBody>
              <Tabs>
                <Tab title="Star">
                  <div>You have {starCount} stars</div>
                  <Spacer y={3} />
                  <ScrollShadow
                    // hideScrollBar
                    className=" h-[300px]"
                    isEnabled={false}
                  >
                    {components}
                  </ScrollShadow>
                </Tab>
                <Tab title="Account">
                  <UserUi userData={userData} session={p.session} />
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

export function Accept({ isOpen, onOpenChange, title, content, actionFunc }) {
  // console.log(props.title);

  return (
    <>
      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{content}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    actionFunc();
                  }}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
