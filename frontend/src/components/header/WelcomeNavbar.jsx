import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

import { toast } from "react-toastify";

import ViteLogo from "../../../public/vite_old.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function WelcomeNavbar({}) {
  const location = useLocation(); // to get pathname
  const navigate = useNavigate();

  // Define initial state for navigation items
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/welcome", current: false },
    { name: "About", href: "/about", current: false },
    { name: "Contact Us", href: "/contact-us", current: false },
    // { name: "Proposals", href: "/proposals/sent", current: false },
    // { name: "Create Project", href: "/project/create", current: false },
    // { name: 'Services', href: '/services', current: false },
    // { name: 'Contact', href: '/contact', current: false },
  ]);

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => {
      // Check if the href matches the current location's pathname
      if (
        item.href === location.pathname ||
        (item.name === "Proposals" &&
          location.pathname === "/proposals/received")
      ) {
        return { ...item, current: true };
      } else {
        return { ...item, current: false };
      }
    });
    setNavigation(updatedNavigation);
  }, [location.pathname]);

  // Function to handle click on a navigation item
  const handleNavItemClick = (clickedItem) => {
    // console.log(clickedItem);
    // Create a copy of the navigation array
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: item === clickedItem,
    }));
    // Update the state with the modified navigation array
    setNavigation(updatedNavigation);
  };

  // Function to handle sign-in click
  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 relative z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="relative flex h-16 items-center justify-between mx-10">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <a href="/welcome"> {/* Add Link wrapper */}
                    <img
                      className="h-8 w-auto"
                      src={ViteLogo}
                      alt="Your Company"
                    />
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block flex-grow">
                  <div className="flex justify-end space-x-4">
                    {navigation.map((item, index) => (
                      <a
                        key={index}
                        href={item.href} // Use "to" prop instead of "href"
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                        onClick={() => handleNavItemClick(item)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <a
                href="/sign-in"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Sign In
                </a>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href} // Use "to" prop instead of "href"
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                  onClick={() => handleNavItemClick(item)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
