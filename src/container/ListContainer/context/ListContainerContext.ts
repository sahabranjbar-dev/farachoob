"use client";

import { createContext } from "react";
import { IListContainerContext } from "../meta/type";

export const ListContainerContext = createContext<IListContainerContext | null>(
  null
);
