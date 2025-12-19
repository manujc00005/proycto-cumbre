export interface Organizer {
  name: string;
  nif: string;
  address: string;
  email: string;
  phone: string;
  web?: string;
}

export const DEFAULT_ORGANIZER: Organizer = {
  name: "Club Deportivo Proyecto Cumbre",
  nif: "G75790246",
  address: "PS De los Tilos n. 67, 2º-2, 29006 Málaga",
  email: "privacidad@proyecto-cumbre.es",
  phone: "692 085 193",
  web: "https://proyecto-cumbre.es",
} as const;
