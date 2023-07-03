import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function ListDropDown({ sources, selected, setSelected }: any) {
  sources = sources.sort((a: any, b: any) => a.name.localeCompare(b.name));

  return (
    sources.length > 0 && (
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative min-w-[15rem] w-fit ">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2  sm:text-sm">
            <span className="block truncate">
              {selected ? selected.name : "Choose a window"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {sources.map((source: any, index: any) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 text-gray-800" : "text-gray-900"
                    }`
                  }
                  value={source}
                >
                  {
                    <>
                      <span
                        className={`block truncate ${
                          selected && selected.id === source.id
                            ? "font-medium"
                            : "font-normal"
                        }`}
                      >
                        {source.name}
                      </span>
                      {selected && selected.id === source.id ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  }
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    )
  );
}
