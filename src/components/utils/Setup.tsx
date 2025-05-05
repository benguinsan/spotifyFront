'use client';

import {Flip, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useTheme} from "next-themes";

export default function Setup() {
  const {theme} = useTheme()

  return <ToastContainer
    position="bottom-right"
    theme={theme}
    autoClose={2500}
    limit={1}
    transition={Flip}
  />;
}