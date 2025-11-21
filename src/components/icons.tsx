import type { SVGProps } from 'react';

export function SchoolPulseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 128a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Z" />
        <path d="m158.63 158.63-32-32a8 8 0 0 1 11.32-11.32l32 32a8 8 0 0 1-11.32 11.32Z" />
        <path d="m107.37 107.37-32-32a8 8 0 0 1 11.32-11.32l32 32a8 8 0 0 1-11.32 11.32Z" />
      </g>
    </svg>
  );
}
