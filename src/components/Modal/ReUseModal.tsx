/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

import { XMarkIcon } from "@heroicons/react/24/outline";

interface modalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  addCloseIcon?: boolean;
  parentClassName?: string;
  closeOnOverlayClick?: boolean;
  isNavModal?: boolean;
}
export default function ReUseModal({
  open,
  setOpen,
  children,
  className,
  parentClassName,
  closeOnOverlayClick,
  addCloseIcon,
  isNavModal,
}: modalProps) {
  // const [open, setOpen] = useState(true);
  if (closeOnOverlayClick === undefined) closeOnOverlayClick = true;
  if (addCloseIcon === undefined) addCloseIcon = false;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={classNames("fixed z-10 inset-0 overflow-y-auto", className, {
          "w-full": isNavModal,
        })}
        onClose={closeOnOverlayClick ? setOpen : () => {}}
      >
        <div
          className={classNames(
            "flex pt-4 px-4 items-center justify-center  min-h-screen  text-center sm:block sm:p-0"
          )}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={classNames("fixed inset-0  transition-opacity", {
                " bg-gray-800 bg-opacity-75 backdrop-blur-sm": !isNavModal,
                "bg-white": isNavModal,
              })}
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classNames(
                `relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle w-fit sm:p-6 ${parentClassName}`,
                {
                  "shadow-xl": !isNavModal,
                  "w-full !pt-0 !py-0 !my-0 !px-5": isNavModal,
                }
              )}
            >
              {addCloseIcon && (
                <div
                  className="absolute  right-6 top-6 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </div>
              )}
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
