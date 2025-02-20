import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export type TypeaheadOption = Readonly<{
  // String value to uniquely identify the option.
  id: string;
  label: string;
  value: string;
}>;

type Attributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'disabled'
  | 'name'
  | 'onBlur'
  | 'onFocus'
  | 'pattern'
  | 'placeholder'
  | 'required'
>;

type Props = Readonly<{
  isLabelHidden?: boolean;
  label: string;
  noResultsMessage?: string;
  nullable?: boolean;
  onQueryChange: (
    value: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onSelect: (option: TypeaheadOption) => void;
  options: ReadonlyArray<TypeaheadOption>;
  value?: TypeaheadOption;
}> &
  Readonly<Attributes>;

export default function Typeahead({
  disabled = false,
  isLabelHidden,
  label,
  noResultsMessage = 'No results',
  nullable = false,
  options,
  onQueryChange,
  required,
  value,
  onSelect,
  ...props
}: Props) {
  const [query, setQuery] = useState('');
  return (
    <Combobox
      by="id"
      disabled={disabled}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      multiple={false}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      nullable={nullable}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      value={value}
      onChange={(newValue) => {
        if (newValue == null) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onSelect(newValue as TypeaheadOption);
      }}>
      <Combobox.Label
        className={clsx(
          isLabelHidden
            ? 'sr-only'
            : 'mb-1 block text-sm font-medium text-slate-700',
        )}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger-500">
            {' '}
            *
          </span>
        )}
      </Combobox.Label>
      <div className="relative">
        <div className="focus-visible:ring-offset-primary-300 relative w-full cursor-default overflow-hidden rounded-lg border border-slate-300 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
          <Combobox.Input
            className={clsx(
              'w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-slate-900 focus:ring-0',
              disabled && 'pointer-events-none select-none bg-slate-100',
            )}
            displayValue={(option) =>
              (option as unknown as TypeaheadOption)?.label
            }
            required={required}
            onChange={(event) => {
              setQuery(event.target.value);
              onQueryChange(event.target.value, event);
            }}
            {...props}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-slate-400"
            />
          </Combobox.Button>
        </div>
        <Transition
          afterLeave={() => setQuery('')}
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-slate-700">
                {noResultsMessage}
              </div>
            ) : (
              options.map((option) => (
                <Combobox.Option
                  key={option.id}
                  className={({ active }) =>
                    clsx(
                      'relative cursor-default select-none py-2 px-4 text-slate-500',
                      active && 'bg-slate-100',
                    )
                  }
                  value={option}>
                  {({ selected }) => (
                    <span
                      className={clsx(
                        'block truncate',
                        selected ? 'font-medium' : 'font-normal',
                      )}>
                      {option.label}
                    </span>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
