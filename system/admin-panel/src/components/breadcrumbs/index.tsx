import { Menu, Transition } from "@headlessui/react";
import {
  ChevronRightIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  link?: string;
  title: string;
};

type BreadcrumbProps = {
  path?: BreadcrumbItem[];
};

export const TBreadcrumbs = (props: BreadcrumbProps) => {
  const { path = [] } = props;

  const [last, penultimate, ...rest] = [...path].reverse();
  const lastTwo = [penultimate, last].filter(k => k)

  return (
    <h1 className="font-bold h-8 my-2 text-base max-w-[calc(100vw-100px)] overflow-x-auto whitespace-nowrap inline-block md:h-9 md:text-xl lg:max-w-fit lg:h-10 lg:text-3xl">
      {rest && rest.length > 0 && <>
        <Menu
          as="div"
          className="text-center relative inline-block">
          <div>
            <Menu.Button className="font-medium text-sm text-gray-500 self-center inline-flex justify-center focus:outline-none focus-visible:ring-white focus-visible:ring-2 focus-visible:ring-opacity-75">
              <DotsVerticalIcon
                className="h-5 top-1 text-gray-500 w-5 relative inline-block self-center md:top-1 lg:top-[0.5px] hover:text-indigo-600"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95">
            <Menu.Items className="divide-y bg-white rounded-md divide-gray-100 shadow-lg ring-black mt-2 origin-top-left left-0 ring-1 ring-opacity-5 w-56 absolute focus:outline-none">
              <div className="py-1 px-1">
                {rest.map((itm, idx) => (
                  <Link key={idx} to={itm.link}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                          {itm.title}
                        </button>
                      )}
                    </Menu.Item>
                  </Link>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <ChevronRightIcon className="h-7 mr-2 mb-[3px] text-gray-300 w-7 inline-block" />
        </>
      }
      {lastTwo
        .map((itm, idx) => {
          if (idx === lastTwo.length - 1) {
            return <span key={idx} className="text-black inline-block">{itm.title}</span>;
          }

          return (
            <React.Fragment key={idx}>
              <Link
                to={itm.link}
                className="text-gray-500 inline-block hover:text-indigo-600">
                {itm.title}
              </Link>
              <ChevronRightIcon className="h-7 mx-2 mb-[3px] text-gray-300 w-7 inline-block" />
            </React.Fragment>
          );
        })}
    </h1>
  );
};
