import { useMediaQuery, useTheme } from "@mui/material";

function useIsWidthUp(breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
}
function useIsWidthDown(breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}

export {
  useIsWidthUp,
  useIsWidthDown,
}