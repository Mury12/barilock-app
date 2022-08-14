import { NavItem } from "./types/NavItem";

export const NavItems: NavItem[] = [
  {
    name: "Início",
    uri: "/home",
    icon: "home",
  },
  {
    name: "Administração",
    uri: "/painel-administrativo",
    icon: "cog",
    protected: true,
  },
];
