export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Login URL now points to the local login page instead of Manus OAuth portal
export const getLoginUrl = () => {
  return "/login";
};
