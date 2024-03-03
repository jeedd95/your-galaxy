"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Switch,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaQuestion } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { SiVelog } from "react-icons/si";
import { FaGithub } from "react-icons/fa6";

export default function Information() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState(false);

  return (
    <>
      <FaQuestion
        onClick={() => {
          onOpen();
        }}
        className="cursor-pointer"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Your Galaxy</ModalHeader>
          <ModalBody>
            <Tabs>
              <Tab title="Info">
                {selected ? (
                  <>
                    <p>Decorate the stars with other users !</p>
                    <Spacer y={5} />
                    <div className="leading-5">
                      Hello, thank you for visiting.
                      <p>
                        This website is the first Toy Project website for my
                        portfolio.
                      </p>
                      <p>
                        There are many shortcomings, but I would appreciate it
                        if you could enjoy it and let me know the bugs or
                        improvements.
                      </p>
                      Also, I would appreciate it if you could promote it a lot.
                    </div>
                    <Spacer y={3} />
                    <div className="text-xs text-gray-500">
                      <p>I do not use the website commercially.</p>
                      <p>
                        This version is a test version, and the information of
                        the stars that have been placed in the account
                        information can be deleted or changed.
                      </p>
                      <p>
                        Improper nicknames or profiles can also be arbitrarily
                        deleted.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>다른 유저와 함께 별을 수놓아보세요 !</p>
                    <Spacer y={5} />
                    <div className="leading-5">
                      <p>안녕하세요 방문해 주셔서 감사합니다.</p>
                      <p>
                        이 웹사이트는 제 포트폴리오 용도인 첫 번째 토이 프로젝트
                        웹사이트입니다.
                      </p>
                      미흡한 점도 많으나 재밌게 즐겨주시고 버그나 개선점들을
                      저한테 알려주시면 감사하겠습니다.
                      <div> 또한 홍보도 많이 해주시면 감사하겠습니다.</div>
                    </div>
                    <Spacer y={3} />
                    <div className="text-xs text-gray-500">
                      <p>웹 사이트를 상업적으로 사용하지 않습니다.</p>
                      <p>
                        이 버전은 테스트 버전으로 계정 정보나 놓은 별들의 정보가
                        삭제, 변경이 될 수 있습니다.
                      </p>
                      <p>
                        부적절한 닉네임이나 프로필도 임의로 삭제 될 수 있습니다.
                      </p>
                    </div>
                  </>
                )}
              </Tab>
              <Tab title="Source">
                <div className="flex justify-between">
                  <Image src="/star.png" alt="star" width={15} height={15} />
                  <Link
                    href="https://www.flaticon.com/free-icons/geometric"
                    title="geometric icons"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Geometric icons created by GOWI - Flaticon
                  </Link>
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <div className="justify-self-start">
              <Switch
                isSelected={selected}
                onValueChange={setSelected}
                size="sm"
              ></Switch>
            </div>
            {/* <div className="flex justify-self-end"> */}
            <div>
              <div className="flex justify-start">
                <MdEmail />
                <Spacer x={2} />
                jeedd95@gmail.com
              </div>
              <Spacer y={3} />
              <div className="flex justify-start">
                <SiVelog />
                <Spacer x={2} />
                <Link
                  href="https://velog.io/@jeedd95/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  velog.io/@jeedd95
                </Link>
              </div>
              <Spacer y={3} />
              <div className="flex justify-start">
                <FaGithub />
                <Spacer x={2} />
                <Link
                  href="https://github.com/jeedd95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/jeedd95
                </Link>
              </div>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
