import { useMediaQuery, useTheme } from "@material-ui/core";

export function useIsWidthUp(breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
}
export function useIsWidthDown(breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}