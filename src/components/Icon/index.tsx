import { JSX } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

const icons = {
  "x-circle": (
    <path
      d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
} as const;

type IconName = keyof typeof icons;

interface Props {
  name: IconName;
  className?: string;
}

export const Icon = ({ name, className }: Props): JSX.Element => {
  const icon = icons[name];
  console.log(icon);
  return (
    <i className={clsx(styles.icon, className)} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icon}
      </svg>
    </i>
  );
};
